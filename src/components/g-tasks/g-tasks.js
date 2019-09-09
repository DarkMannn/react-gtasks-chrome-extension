import React, {
    useState,
    useEffect,
    useLayoutEffect
} from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import TasklistItem from './tasklist-item/tasklist-item.js';
import TaskItem from './task-item/task-item.js';
import TaskItemZoomed from './task-item-zoomed/task-item-zoomed.js';

const mainCss = css`
    outline: none;
    border-right: ${({ isAppFocused }) => isAppFocused ? '3px solid gray' : 'none'};
    border-left: ${({ isAppFocused }) => isAppFocused ? '3px solid gray' : 'none'};
`;
const headingCss = css`
    height: 30px;
    padding: 15px 0 15px 0;
    border-top: 4px double black;
    border-bottom: 4px double black;
    outline: ${({ isHovered }) => isHovered ? '3px solid gold' : 'none'};
    outline-offset: -3px;
`;
const headingHelperCss = css`
    height: 5px;
    padding: 0;
    margin-top: 0;
    font-size: 10px;
`;

function GTasks({ gapiTasks }) {

    const [cursor, setCursor] = useState(0);
    const [isAppFocused, setIsAppFocused] = useState(false);
    const [itemMaxLimit, setItemMaxLimit] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [navigationDir, setNavigationDir] = useState('down');
    const [items, setItems] = useState([{ title: 'Loading...', id: '123' }]);
    const [zoomedItem, setZoomedItem] = useState(null);
    const [tasklist, setTasklist] = useState('Loading...');
    const [isListPickerExpanded, setIsListPickerExpanded] = useState(false);
    const [isItemExpanded, setIsItemExpanded] = useState(false);
    const [isEditingActive, setIsEditingActive] = useState(false);
    const [isNextBlurInsertion, setIsNextBlurInsertion] = useState(false);

    const oneIfPickerExpanded = isListPickerExpanded ? 1 : 0;
    const oneIfPickerNotExpanded = !isListPickerExpanded ? 1 : 0;

    const shouldRender = (index) => index >= itemOffset - oneIfPickerNotExpanded
        && index <= itemMaxLimit + itemOffset - oneIfPickerNotExpanded;

    const loadTasklists = () => gapiTasks.tasklists.list()
        .then(({ result }) => {

            setItems(result.items);
        });
    const loadTasks = (tasklist) => gapiTasks.tasks.list({ tasklist })
        .then(({ result }) => {

            result.items.sort((taskA, taskB) => parseInt(taskA.position) - parseInt(taskB.position));
            setItems(result.items);
        });
    const loadTask = (tasklist, task) => gapiTasks.tasks.get({ tasklist, task })
        .then(({ result }) => {

            setZoomedItem(result);
        });
    const createTask = (tasklist, body) => gapiTasks.tasks.insert({ tasklist }, body)
        .then(() => loadTasks(tasklist));
    const updateTask = (tasklist, task, previous, body) => gapiTasks.tasks.update({ tasklist, task }, body)
        .then(() => gapiTasks.tasks.move({ tasklist, task, previous }))
        .then(() => loadTasks(tasklist));

    const onBlurCallback = (newTitle) => {

        setIsEditingActive(false);

        const editedTask = items[cursor - 1];
        const previousTask = items[cursor - 2];

        const shouldNotUpdate = editedTask.title === newTitle && !isNextBlurInsertion;
        if (shouldNotUpdate) {
            return;
        }

        if (isNextBlurInsertion) {
            setIsNextBlurInsertion(false);
            createTask(tasklist.id, { title: newTitle });
            return;
        }

        editedTask.title = newTitle;
        updateTask(tasklist.id, editedTask.id, previousTask.id, editedTask);
    };

    const keyCodeMap = {
        '38': () => { // arrow up

            if (!isEditingActive && cursor > 0) {
                setCursor(prevCursor => prevCursor - 1);
                setNavigationDir('up');
            }
        },
        '40': () => { // arrow down

            if (!isEditingActive && cursor < items.length - oneIfPickerExpanded) {
                setCursor(prevCursor => prevCursor + 1);
                setNavigationDir('down');
            }
        },
        '13': ({ ctrlKeyPressed, shiftKeyPressed }) => { // enter

            if (isListPickerExpanded) {
                const currentTasklist = items[cursor];
                loadTasks(currentTasklist.id)
                    .then(() => {

                        setTasklist(currentTasklist);
                        setIsListPickerExpanded(false);
                        setCursor(1);
                        setItemOffset(0);
                    });
            }
            else if (cursor === 0) {
                loadTasklists()
                    .then(() => {

                        setIsListPickerExpanded(true);
                        setCursor(0);
                    });
            }
            else if (cursor > 0) {
                if (shiftKeyPressed) {
                    loadTask(tasklist.id, items[cursor - 1].id)
                        .then(() => {

                            setIsItemExpanded(true);
                        });
                }
                else if (ctrlKeyPressed) {
                    setItems([{ title: '' }, ...items]);
                    setCursor(1);
                    setIsEditingActive(true);
                    setIsNextBlurInsertion(true);
                }
                else {
                    setIsEditingActive(true);
                }
            }
        }
    };
    window.onkeydown = ({ keyCode, ctrlKey: ctrlKeyPressed, shiftKey: shiftKeyPressed }) => {

        if (keyCode.toString() === '76' && ctrlKeyPressed && shiftKeyPressed) {
            setIsAppFocused(!isAppFocused);
            return;
        }
        if (isAppFocused && keyCodeMap[keyCode]) {
            keyCodeMap[keyCode]({ ctrlKeyPressed, shiftKeyPressed});
        }
    }

    useEffect(function initData() {

        gapiTasks.tasklists.list()
            .then(({ result }) => {

                setTasklist(result.items[0]);
                return gapiTasks.tasks.list({ tasklist: result.items[0].id });
            })
            .then(({ result }) => {

                result.items.sort((taskA, taskB) => parseInt(taskA.position) - parseInt(taskB.position));
                setItems(result.items);
            });
    }, [gapiTasks.tasklists, gapiTasks.tasks]);

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

    return <div isAppFocused={isAppFocused} css={mainCss}>
        <div css={headingCss} isHovered={!isListPickerExpanded && cursor === 0}>
            {isListPickerExpanded ? 'Select a Task List' : tasklist.title}
            {!isListPickerExpanded && cursor === 0 && (
                <p css={headingHelperCss}>* press enter to change tasklist*</p>
            )}
        </div>
        {!isItemExpanded && (isListPickerExpanded
            ? items.map((item, index) =>
                shouldRender(index) && <TasklistItem
                    key={item.id}
                    title={item.title}
                    isHovered={index === cursor}>
                </TasklistItem>
            )
            : items.map((item, index) =>
                shouldRender(index) && <TaskItem
                    key={item.id || index}
                    title={item.title}
                    due={item.due && new Date(item.due).toISOString().split('T')[0]}
                    notes={item.notes}
                    isHovered={index === cursor - 1}
                    isEditingActive={isEditingActive && index === cursor - 1}
                    onBlurCallback={onBlurCallback}>
                </TaskItem>
            )
        )}
        {isItemExpanded &&
            <TaskItemZoomed
                title={zoomedItem.title}
                notes={zoomedItem.notes}
                due={zoomedItem.due}>
            </TaskItemZoomed>
        }
    </div>;
}

export default GTasks;
