import React, {
    useState,
    useEffect,
    useLayoutEffect
} from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import TasklistItem from './tasklist-item/tasklist-item.js';
import TaskItem from './task-item/task-item.js';

const mainCss = css`
    outline: none;
`;
const headingCss = css`
    padding: 15px 0 15px 0;
    border-top: 4px double black;
    border-bottom: 4px double black;
    outline: ${({ isHovered }) => isHovered ? '3px solid grey' : 'none'};
    outline-offset: -3px;
`;

function GTasks({ gapiTasks }) {

    const [cursor, setCursor] = useState(0);
    const [itemMaxLimit, setItemMaxLimit] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [navigationDir, setNavigationDir] = useState('down');
    const [items, setItems] = useState([{ title: 'Loading...', id: '123' }]);
    const [tasklist, setTasklist] = useState('Loading...');
    const [isListPickerExpanded, setIsListPickerExpanded] = useState(false);

    const oneIfPickerExpanded = isListPickerExpanded ? 1 : 0;
    const oneIfPickerNotExpanded = !isListPickerExpanded ? 1 : 0;

    const shouldRender = (index) => index > itemOffset - oneIfPickerNotExpanded
        && index <= itemMaxLimit + itemOffset - oneIfPickerNotExpanded;

    const loadTasklists = () => gapiTasks.tasklists.list()
        .then(({ result }) => {

            setItems(result.items);
        });
    const loadTasks = (tasklist) => gapiTasks.tasks.list({ tasklist })
        .then(({ result }) => {

            setItems(result.items);
        });

    const keyCodeMap = {
        '38': () => { // arrow up
            if (cursor > 0 + oneIfPickerExpanded) {
                setCursor(prevCursor => prevCursor - 1);
                setNavigationDir('up');
            }
        },
        '40': () => { // arrow down
            if (cursor < items.length - oneIfPickerExpanded) {
                setCursor(prevCursor => prevCursor + 1);
                setNavigationDir('down');
            }
        },
        '13': () => { // enter
            if (!isListPickerExpanded && cursor === 0) {
                loadTasklists()
                    .then(() => {

                        setIsListPickerExpanded(true);
                        setCursor(1);
                    });
            }
            else if (isListPickerExpanded) {
                loadTasks(items[cursor].id)
                    .then(() => {

                        setIsListPickerExpanded(false);
                        setCursor(1);
                        setItemOffset(0);
                    });
            }
        }
    };
    const navigationHandler = ({ keyCode }) => keyCodeMap[keyCode] && keyCodeMap[keyCode]();

    useEffect(function initData() {

        gapiTasks.tasklists.list()
            .then(({ result }) => {

                setTasklist(result.items[0].title);
                return gapiTasks.tasks.list({ tasklist: result.items[0].id });
            })
            .then(({ result }) => {

                setItems(result.items);
            });
    }, [gapiTasks.tasklists, gapiTasks.tasks, tasklist.title]);

    useEffect(function calculateItemMaxLimit() {

        const upperHeaderHeight = window.innerHeight * 0.1;
        const taskListNameHeight = 63;
        const taskItemHeight = 36;
        const calculateItemMaxLimit = () => Math.floor(
            ((window.innerHeight - upperHeaderHeight - taskListNameHeight) / taskItemHeight) - 1
        );

        window.addEventListener('resize', () => {

            setItemMaxLimit(calculateItemMaxLimit());
        });
        setItemMaxLimit(calculateItemMaxLimit());
    }, []);

    useLayoutEffect(function calculateItemOffset() {

        let newItemOffset;
        if ((navigationDir === 'down') && (cursor >= itemOffset + itemMaxLimit + 1)) {
            newItemOffset = itemOffset + 1;
        }
        else if ((navigationDir === 'up') && (itemOffset === cursor) && (itemOffset !== 0)) {
            newItemOffset = itemOffset - 1;
        }
        else {
            newItemOffset = itemOffset;
        }

        setItemOffset(newItemOffset);
    }, [navigationDir, cursor, itemMaxLimit, itemOffset]);

    return <div css={mainCss} onKeyDown={navigationHandler} tabIndex="0">
        <div css={headingCss} isHovered={cursor === 0}>
            {isListPickerExpanded ? 'Select a Task List' : tasklist}
        </div>
        {isListPickerExpanded
            ? items.map((item, index) =>
                shouldRender(index) && <TasklistItem
                    key={item.id}
                    title={item.title}
                    isHovered={index === cursor}>
                </TasklistItem>
            )
            : items.map((item, index) =>
                shouldRender(index) && <TaskItem
                    key={item.id}
                    title={item.title}
                    due={item.due && new Date(item.due).toISOString().split('T')[0]}
                    notes={item.notes}
                    isHovered={index === cursor - 1}>
                </TaskItem>
            )
        }
    </div>;
}

export default GTasks;
