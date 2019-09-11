/* eslint-disable react-hooks/exhaustive-deps */
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
    outline: ${({ isHovered }) => isHovered ? '3px solid khaki' : 'none'};
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
    const [isListPickerExpanded, setIsListPickerExpanded] = useState(true);
    const [isItemExpanded, setIsItemExpanded] = useState(false);
    const [isEditingActive, setIsEditingActive] = useState(false);
    const [isNextBlurInsertion, setIsNextBlurInsertion] = useState(false);
    const [showCompleted, setShowCompleted] = useState(true);

    const oneIfPickerExpanded = isListPickerExpanded ? 1 : 0;
    const oneIfPickerNotExpanded = !isListPickerExpanded ? 1 : 0;

    const shouldRender = (index) => index > itemOffset - 1
        && index <= itemMaxLimit + itemOffset - oneIfPickerNotExpanded;

    const loadTasklists = () => gapiTasks.tasklists.list()
        .then(({ result }) => {

            setItems(result.items);
        });
    const loadTasks = (tasklist) => gapiTasks.tasks.list({ tasklist, showCompleted, maxResults: 100 })
        .then(({ result }) => {

            const tasks = result.items || [];
            tasks.sort((taskA, taskB) => parseInt(taskA.position) - parseInt(taskB.position));
            setItems(tasks);
        });
    const loadTask = (tasklist, task) => gapiTasks.tasks.get({ tasklist, task })
        .then(({ result }) => {

            setZoomedItem(result);
        });
    const createTask = (tasklist, body) => gapiTasks.tasks.insert({ tasklist }, body)
        .then(() => loadTasks(tasklist));
    const moveTask = (tasklist, task, previous) => gapiTasks.tasks.move({ tasklist, task, previous })
        .then(() => loadTasks(tasklist));
    const updateTask = (tasklist, task, previous, body) => gapiTasks.tasks.update({ tasklist, task }, body)
        .then(() => previous && moveTask(tasklist, task, previous));
    const deleteTask = (tasklist, task) => gapiTasks.tasks.delete({ tasklist, task })
        .then(() => loadTasks(tasklist));

    const onBlurCallback = (newTitle) => {

        setIsEditingActive(false);

        if (isNextBlurInsertion) {
            setIsNextBlurInsertion(false);
            createTask(tasklist.id, { title: newTitle });
            return;
        }

        const updatedTask = items[cursor - 1];
        const previousTask = items[cursor - 2];

        const shouldNotUpdate = updatedTask.title === newTitle;
        if (shouldNotUpdate) {
            return;
        }

        updatedTask.title = newTitle;
        updateTask(
            tasklist.id,
            updatedTask.id,
            previousTask && previousTask.id,
            updatedTask
        );
    };

    const keyCodeMap = {
        '38': ({ shiftKeyPressed }) => { // arrow up

            if (shiftKeyPressed) {

                const movedTask = items[cursor - 1];
                const newPreviousTask = items[cursor - 3];
                moveTask(tasklist.id, movedTask.id, newPreviousTask && newPreviousTask.id)
                .then(() => {

                    setCursor(prevCursor => prevCursor - 1);
                });
            }
            else if (!isEditingActive && cursor > 0) {
                setCursor(prevCursor => prevCursor - 1);
                setNavigationDir('up');
            }
        },
        '40': ({ shiftKeyPressed }) => { // arrow down

            if (shiftKeyPressed) {

                const movedTask = items[cursor - 1];
                const newPreviousTask = items[cursor];
                if (newPreviousTask) {
                    moveTask(tasklist.id, movedTask.id, newPreviousTask.id)
                    .then(() => {

                        setCursor(prevCursor => prevCursor + 1);
                    });
                }
            }
            else if (!isEditingActive && cursor < items.length - oneIfPickerExpanded) {
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
            else {
                if (cursor === 0 && !ctrlKeyPressed && !shiftKeyPressed) {
                    loadTasklists()
                        .then(() => {

                            setIsListPickerExpanded(true);
                            setCursor(0);
                        });
                    return;
                }
                if (cursor > 0 && shiftKeyPressed) {
                    loadTask(tasklist.id, items[cursor - 1].id)
                        .then(() => {

                            setIsItemExpanded(true);
                        });
                    return;
                }
                if (ctrlKeyPressed) {
                    setItems([{ title: '' }, ...items]);
                    setCursor(1);
                    setIsEditingActive(true);
                    setIsNextBlurInsertion(true);
                    return;
                }
                setIsEditingActive(true);
            }
        },
        '46': ({ ctrlKeyPressed }) => { // del

            if (ctrlKeyPressed) {
                deleteTask(tasklist.id, items[cursor - 1].id)
                    .then(() => {

                        setCursor(0);
                    });
            }
        },
        '32': ({ ctrlKeyPressed }) => { // space

            if (!ctrlKeyPressed) {
                return;
            }

            const updatedTask = items[cursor - 1];
            const previousTask = items[cursor - 2];

            updatedTask.status = updatedTask.status === 'needsAction' ? 'completed' : 'needsAction';
            updateTask(
                tasklist.id,
                updatedTask.id,
                previousTask && previousTask.id,
                updatedTask
            );

        },
        '72': ({ ctrlKeyPressed, shiftKeyPressed }) => { // h

            if (ctrlKeyPressed && shiftKeyPressed) {
                setShowCompleted(!showCompleted);
                loadTasks(tasklist.id, !showCompleted);
            }
        }
    };
    window.onkeydown = ({ keyCode, ctrlKey: ctrlKeyPressed, shiftKey: shiftKeyPressed }) => {

        if (keyCode === 76 && ctrlKeyPressed && shiftKeyPressed) { // l
            setIsAppFocused(!isAppFocused);
        }
        else if (isAppFocused && keyCodeMap[keyCode]) {
            keyCodeMap[keyCode]({ ctrlKeyPressed, shiftKeyPressed});
        }
    }

    useEffect(function initData() {

        loadTasklists();
    }, []);

    useEffect(function calculateItemMaxLimit() {

        const upperHeaderHeight = window.innerHeight * 0.1;
        const taskListNameHeight = 68;
        const taskItemHeight = 36;
        const newItemMaxLimit = Math.floor(
            ((window.innerHeight - upperHeaderHeight - taskListNameHeight) / taskItemHeight) - 1
        );
        setItemMaxLimit(newItemMaxLimit);
        setCursor(0);
        setItemOffset(0);
    }, [window.innerHeight]);

    useLayoutEffect(function calculateItemOffset() {

        if ((navigationDir === 'down') && (cursor >= itemOffset + itemMaxLimit + 1)) {
            setItemOffset(oldItemOffset => oldItemOffset + 1);
            return;
        }
        if ((navigationDir === 'up') && (cursor === itemOffset - oneIfPickerExpanded) && (itemOffset !== 0)) {
            setItemOffset(oldItemOffset => oldItemOffset - 1);
            return;
        }
    }, [cursor]);

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
                    status={item.status}
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
