import React, {
    useState,
    useEffect,
    useLayoutEffect,
    useMemo
} from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import MakeCustomGapiTasks from '../../util/make-custom-gapi-tasks.js';
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
    const [items, setItems] = useState([{ title: 'Loading...', id: '123' }]);
    const [itemMaxLimit, setItemMaxLimit] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [tasklist, setTasklist] = useState('Loading...');

    const [isListPickerExpanded, setIsListPickerExpanded] = useState(true);
    const [isItemExpanded, setIsItemExpanded] = useState(false);
    const [isAppFocused, setIsAppFocused] = useState(false);
    const [isEditingActive, setIsEditingActive] = useState(false);
    const [isNextBlurInsertion, setIsNextBlurInsertion] = useState(false);
    const [navigationDir, setNavigationDir] = useState('down');
    const [showCompleted, setShowCompleted] = useState(true);

    const oneIfPickerExpanded = isListPickerExpanded ? 1 : 0;
    const oneIfPickerNotExpanded = !isListPickerExpanded ? 1 : 0;

    const GapiTasks = useMemo(() => MakeCustomGapiTasks(gapiTasks), [gapiTasks]);

    const shouldRender = (index) => index > itemOffset - 1
        && index <= itemMaxLimit + itemOffset - oneIfPickerNotExpanded;

    const onBlurCallback = async (newTitle) => {

        setIsEditingActive(false);

        if (isNextBlurInsertion) {
            setIsNextBlurInsertion(false);
            await GapiTasks.createTask(tasklist.id, { title: newTitle });
            const tasks = await GapiTasks.loadTasks(tasklist.id, showCompleted);
            setItems(tasks);
            return;
        }

        const updatedTask = items[cursor - 1];
        const previousTask = items[cursor - 2];

        const shouldNotUpdate = updatedTask.title === newTitle;
        if (shouldNotUpdate) {
            return;
        }

        updatedTask.title = newTitle;
        await GapiTasks.updateTask(
            tasklist.id,
            updatedTask.id,
            updatedTask
        );
        if (previousTask && previousTask.id) {
            await GapiTasks.moveTask(tasklist.id, updatedTask.id, previousTask && previousTask.id);
        }
        const tasks = await GapiTasks.loadTasks(tasklist.id, showCompleted);
        setItems(tasks);
    };

    const keyCodeMap = {
        '38': async ({ shiftKeyPressed }) => { // arrow up

            if (shiftKeyPressed) {

                const movedTask = items[cursor - 1];
                const newPreviousTask = items[cursor - 3];
                const isFirstItem = cursor === 1;
                if (!isFirstItem) {
                    await GapiTasks.moveTask(tasklist.id, movedTask.id, newPreviousTask && newPreviousTask.id);
                    const tasks = await GapiTasks.loadTasks(tasklist.id, showCompleted);
                    setItems(tasks);
                    setCursor(prevCursor => prevCursor - 1);
                }
            }
            else if (!isEditingActive && cursor > 0) {
                setCursor(prevCursor => prevCursor - 1);
                setNavigationDir('up');
            }
        },
        '40': async ({ shiftKeyPressed }) => { // arrow down

            if (shiftKeyPressed) {

                const movedTask = items[cursor - 1];
                const newPreviousTask = items[cursor];
                if (newPreviousTask) {
                    await GapiTasks.moveTask(tasklist.id, movedTask.id, newPreviousTask.id);
                    const tasks = await GapiTasks.loadTasks(tasklist.id, showCompleted);
                    setItems(tasks);
                    setCursor(prevCursor => prevCursor + 1);
                }
            }
            else if (!isEditingActive && cursor < items.length - oneIfPickerExpanded) {
                setCursor(prevCursor => prevCursor + 1);
                setNavigationDir('down');
            }
        },
        '13': async ({ ctrlKeyPressed, shiftKeyPressed }) => { // enter

            if (isListPickerExpanded) {
                const currentTasklist = items[cursor];
                const tasks = await GapiTasks.loadTasks(currentTasklist.id, showCompleted);
                setItems(tasks);
                setTasklist(currentTasklist);
                setIsListPickerExpanded(false);
                setCursor(1);
                setItemOffset(0);
            }
            else {
                if (cursor === 0 && !ctrlKeyPressed && !shiftKeyPressed) {
                    const { items } = await GapiTasks.loadTasklists();
                    setItems(items);
                    setIsListPickerExpanded(true);
                    setCursor(0);
                    return;
                }
                if (cursor > 0 && shiftKeyPressed) {
                    const task = await GapiTasks.loadTask(tasklist.id, items[cursor - 1].id);
                    setItems([task])
                    setIsItemExpanded(true);
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
        '46': async ({ ctrlKeyPressed }) => { // del

            if (ctrlKeyPressed) {
                await GapiTasks.deleteTask(tasklist.id, items[cursor - 1].id);
                const tasks = await GapiTasks.loadTasks(tasklist.id, showCompleted);
                setItems(tasks);
                setCursor(0);
            }
        },
        '32': async ({ ctrlKeyPressed }) => { // space

            if (!ctrlKeyPressed) {
                return;
            }

            const updatedTask = items[cursor - 1];
            const previousTask = items[cursor - 2];

            updatedTask.status = updatedTask.status === 'needsAction' ? 'completed' : 'needsAction';
            await GapiTasks.updateTask(
                tasklist.id,
                updatedTask.id,
                updatedTask
            );
            if (previousTask && previousTask.id) {
                await GapiTasks.moveTask(tasklist.id, updatedTask.id, previousTask && previousTask.id);
            }
            const tasks = await GapiTasks.loadTasks(tasklist.id, showCompleted);
            setItems(tasks);
        },
        '72': async ({ ctrlKeyPressed, shiftKeyPressed }) => { // h

            if (ctrlKeyPressed && shiftKeyPressed) {
                setShowCompleted(!showCompleted);
                const tasks = await GapiTasks.loadTasks(tasklist.id, !showCompleted);
                setItems(tasks);
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

    useEffect(function () {

        (async function initData() {

            const { items } = await GapiTasks.loadTasklists();
            setItems(items);
        })();
    }, [GapiTasks]);

    useEffect(function calculateItemMaxLimit() {

        const onResize = () => {

            const upperHeaderHeight = window.innerHeight * 0.1;
            const taskListNameHeight = 68;
            const taskItemHeight = 36;
            const newItemMaxLimit = Math.floor(
                ((window.innerHeight - upperHeaderHeight - taskListNameHeight) / taskItemHeight) - 1
            );
            setItemMaxLimit(newItemMaxLimit);
            setItemOffset(0);
            setCursor(0);
        };
        onResize();
        window.addEventListener('resize', onResize);
    }, []);

    useLayoutEffect(function calculateItemOffset() {

        if ((navigationDir === 'down') && (cursor >= itemOffset + itemMaxLimit + 1)) {
            setItemOffset(oldItemOffset => oldItemOffset + 1);
            return;
        }
        if ((navigationDir === 'up') && (cursor === itemOffset - oneIfPickerExpanded) && (itemOffset !== 0)) {
            setItemOffset(oldItemOffset => oldItemOffset - 1);
            return;
        }
    }, [cursor, itemMaxLimit, itemOffset, navigationDir, oneIfPickerExpanded]);

    let headerHtml;
    let itemsHtml;
    if (isItemExpanded) {
        const zoomedItem = items[0];
        headerHtml = 'Return to tasks';
        itemsHtml = <TaskItemZoomed
            title={zoomedItem.title}
            notes={zoomedItem.notes}
            due={zoomedItem.due}>
        </TaskItemZoomed>;
    }
    else if (isListPickerExpanded) {
        headerHtml = 'Select a Task List';
        itemsHtml = items.map((item, index) => shouldRender(index)
            && <TasklistItem
                    key={item.id}
                    title={item.title}
                    isHovered={index === cursor}>
            </TasklistItem>
        );
    }
    else {
        headerHtml = <>
            {tasklist.title}
            {cursor === 0 && <p css={headingHelperCss}>* press enter to change tasklist*</p>}
        </>;
        itemsHtml = items.map((item, index) => shouldRender(index)
            && <TaskItem
                key={item.id || index}
                title={item.title}
                due={item.due && new Date(item.due).toISOString().split('T')[0]}
                notes={item.notes}
                status={item.status}
                isHovered={index === cursor - 1}
                isEditingActive={isEditingActive && index === cursor - 1}
                onBlurCallback={onBlurCallback}>
            </TaskItem>
        );
    }

    return <div isAppFocused={isAppFocused} css={mainCss}>
        <div css={headingCss} isHovered={!isListPickerExpanded && cursor === 0}>{headerHtml}</div>
        {itemsHtml}
    </div>;
}

export default GTasks;
