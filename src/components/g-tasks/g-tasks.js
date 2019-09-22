import React, { useEffect, useLayoutEffect, useReducer, useMemo } from 'react';
import { css } from 'styled-components';
import 'styled-components/macro';
import MakeCustomGapiTasks from '../../util/make-custom-gapi-tasks.js';
import { gTasksReducer, initialState } from './g-tasks-reducer.js';
import { actionCreators } from './g-tasks-actions.js';
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

    const [state, dispatch] = useReducer(gTasksReducer, initialState);

    const {
        cursor,
        items,
        itemMaxLimit,
        itemOffset,
        tasklist,
        isListPickerExpanded,
        isItemExpanded,
        isAppFocused,
        isEditingActive,
        isNextBlurInsertion,
        showCompleted
    } = state;

    const oneIfPickerExpanded = isListPickerExpanded ? 1 : 0;
    const oneIfPickerNotExpanded = !isListPickerExpanded ? 1 : 0;

    const GapiTasks = useMemo(() => MakeCustomGapiTasks(gapiTasks), [gapiTasks]);

    const shouldRender = (index) => index > itemOffset - 1
        && index <= itemMaxLimit + itemOffset - oneIfPickerNotExpanded;

    const onBlurCallback = async (newTitle) => {

        dispatch(actionCreators.toggleIsEditingActive(false));

        if (isNextBlurInsertion) {
            await GapiTasks.createTask(tasklist.id, { title: newTitle });
            const tasks = await GapiTasks.loadTasks(tasklist.id, showCompleted);
            dispatch(actionCreators.reloadTasks(tasks));
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
        dispatch(actionCreators.reloadTasks(tasks));
    };

    const keyCodeMap = {
        '38': async ({ shiftKeyPressed }) => { // arrow up

            if (shiftKeyPressed) {

                const movedTask = items[cursor - 1];
                const newPreviousTask = items[cursor - 3];
                const isFirstItem = cursor === 1;
                if (!isFirstItem) {
                    await GapiTasks.moveTask(
                        tasklist.id,
                        movedTask.id,
                        newPreviousTask && newPreviousTask.id
                    );
                    const tasks = await GapiTasks.loadTasks(tasklist.id, showCompleted);
                    dispatch(actionCreators.moveUp(tasks));
                }
            }
            else if (!isEditingActive && cursor > 0) {
                dispatch(actionCreators.scrollUp());
            }
        },
        '40': async ({ shiftKeyPressed }) => { // arrow down

            if (shiftKeyPressed) {

                const movedTask = items[cursor - 1];
                const newPreviousTask = items[cursor];
                if (newPreviousTask) {
                    await GapiTasks.moveTask(tasklist.id, movedTask.id, newPreviousTask.id);
                    const tasks = await GapiTasks.loadTasks(tasklist.id, showCompleted);
                    dispatch(actionCreators.moveDown(tasks));
                }
            }
            else if (!isEditingActive && cursor < items.length - oneIfPickerExpanded) {
                dispatch(actionCreators.scrollDown());
            }
        },
        '13': async ({ ctrlKeyPressed, shiftKeyPressed }) => { // enter

            if (isListPickerExpanded) {
                const currentTasklist = items[cursor];
                const tasks = await GapiTasks.loadTasks(currentTasklist.id, showCompleted);
                dispatch(actionCreators.loadTasks(tasks, currentTasklist));
            }
            else {
                if (cursor === 0 && !ctrlKeyPressed && !shiftKeyPressed) {
                    const { items } = await GapiTasks.loadTasklists();
                    dispatch(actionCreators.loadTasklists(items));
                    return;
                }
                if (cursor > 0 && shiftKeyPressed) {
                    const task = await GapiTasks.loadTask(tasklist.id, items[cursor - 1].id);
                    dispatch(actionCreators.expandTask([task]));
                    return;
                }
                if (ctrlKeyPressed) {
                    dispatch(actionCreators.createTask(items));
                    return;
                }
                dispatch(actionCreators.editTask());
            }
        },
        '46': async ({ ctrlKeyPressed }) => { // del

            if (ctrlKeyPressed) {
                await GapiTasks.deleteTask(tasklist.id, items[cursor - 1].id);
                const tasks = await GapiTasks.loadTasks(tasklist.id, showCompleted);
                dispatch(actionCreators.deleteTask(tasks));
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
            dispatch(actionCreators.reloadTasks(tasks));
        },
        '72': async ({ ctrlKeyPressed, shiftKeyPressed }) => { // h

            if (ctrlKeyPressed && shiftKeyPressed) {
                const tasks = await GapiTasks.loadTasks(tasklist.id, !showCompleted);
                dispatch(actionCreators.toggleShowCompleted(tasks));
            }
        }
    };

    useEffect(function () {

        (async function initData() {

            const { items } = await GapiTasks.loadTasklists();
            dispatch(actionCreators.loadTasklists(items));
        })();
    }, [GapiTasks]);

    useEffect(function attachKeydownListener() {

        const onKeydown = ({ keyCode, ctrlKey: ctrlKeyPressed, shiftKey: shiftKeyPressed }) => {

            if (keyCode === 76 && ctrlKeyPressed && shiftKeyPressed) { // l
                dispatch(actionCreators.toggleAppFocus());
            }
            else if (isAppFocused && keyCodeMap[keyCode]) {
                keyCodeMap[keyCode]({ ctrlKeyPressed, shiftKeyPressed});
            }
        };
        window.addEventListener('keydown', onKeydown);

        return () => {

            window.removeEventListener('keydown', onKeydown);
        };
    }, [isAppFocused, keyCodeMap]);

    useEffect(function attachResizeContentListener() {

        const onResize = () => {

            dispatch(actionCreators.resizeContent(window.innerHeight));
        };
        onResize();
        window.addEventListener('resize', onResize);
    }, []);

    useLayoutEffect(function calculateItemOffset() {

        dispatch(actionCreators.calculateItemOffset());
    }, [cursor]);

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
