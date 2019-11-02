import { actionCreators } from './g-tasks-actions.js';
import * as RequestsEnqueuer from '../../util/requests-enqueuer.js';
import SortTasks from '../../util/sort-tasks.js';

const MakeKeydownListener = ({
    isLoading, hasErrored, items, cursor, tasklist, task, showCompleted,
    isEditingActive, isListPickerExpanded, isTaskExpanded
}, dispatch, GapiTasks) => {

    const TasklistActionsByKeyCodeHash = {

        38: async () => { // arrow up

            if (!isEditingActive && cursor > 0) {
                dispatch(actionCreators.scrollUp());
            }
        },

        40: async () => { // arrow down

            if (!isEditingActive && cursor < items.length - 1) {
                dispatch(actionCreators.scrollDown());
            }
        },

        13: async ({ ctrlKeyPressed, shiftKeyPressed }) => { // enter

            if (shiftKeyPressed) {
                dispatch(actionCreators.toggleIsLoading());
                const currentTasklist = items[cursor];
                RequestsEnqueuer.enqueue(async () => {

                    const tasks = await GapiTasks.loadTasks(currentTasklist.id, showCompleted);
                    dispatch(actionCreators.loadTasks(SortTasks(tasks), currentTasklist));
                });
                return;
            }
            if (ctrlKeyPressed) {
                dispatch(actionCreators.insertItem());
                return;
            }
            dispatch(actionCreators.editItem());
        },

        46: async ({ ctrlKeyPressed }) => { // del

            if (ctrlKeyPressed) {
                const updatedItems = items.filter((item, index) => index !== cursor);
                dispatch(actionCreators.reloadItems(updatedItems, cursor - 1));
                RequestsEnqueuer.enqueue(() => GapiTasks.deleteTasklist(items[cursor].id));
            }
        }
    };

    const TaskActionsByKeyCodeHash = {

        38: async () => { // arrow up

            if (!isEditingActive && cursor > 0) {
                dispatch(actionCreators.scrollUp());
            }
        },

        40: async () => { // arrow down

            if (!isEditingActive && cursor < items.length) {
                dispatch(actionCreators.scrollDown());
            }
        },

        13: async () => { // enter

            if (cursor === 0) {
                dispatch(actionCreators.toggleIsLoading());
                RequestsEnqueuer.enqueue(async () => {

                    const tasks = await GapiTasks.loadTasks(tasklist.id, showCompleted);
                    dispatch(actionCreators.loadTasks(SortTasks(tasks), tasklist));
                });
            }
            else {
                dispatch(actionCreators.editItem());
            }
        },

        46: async ({ ctrlKeyPressed }) => { // del

            if (ctrlKeyPressed && cursor === 3) {
                dispatch(actionCreators.expandTask({ ...task, due: null }));
                RequestsEnqueuer.enqueue(() => GapiTasks.updateTask(
                    tasklist.id, task.id, { ...task, due: null }
                ));
            }
        }
    };

    const TasksActionsByKeyCodeHash = {

        38: async ({ shiftKeyPressed }) => { // arrow up

            if (shiftKeyPressed && cursor > 0 ) {

                const movedTask = items[cursor - 1];
                const newPreviousTask = items[cursor - 3];
                const newNextTask = items[cursor - 2];
                const isFirstItem = cursor === 1;
                if (isFirstItem || movedTask.status === 'completed') {
                    return;
                }

                const tasks = [
                    ...items.slice(0, cursor - 2),
                    movedTask,
                    newNextTask,
                    ...items.slice(cursor)
                ];

                const isItemCreatedOnBackend = movedTask.etag;
                dispatch(actionCreators.moveUp(tasks));
                if (isItemCreatedOnBackend) {
                    RequestsEnqueuer.enqueue(() => GapiTasks.moveTask(
                        tasklist.id,
                        movedTask.id,
                        newPreviousTask && newPreviousTask.id
                    ));
                }
            }
            else if (!isEditingActive && cursor > 0) {
                dispatch(actionCreators.scrollUp());
            }
        },

        40: async ({ shiftKeyPressed }) => { // arrow down

            if (shiftKeyPressed && cursor !== 0) {

                const movedTask = items[cursor - 1];
                const newPreviousTask = items[cursor];
                if (!newPreviousTask || movedTask.status === 'completed') {
                    return;
                }

                const tasks = [
                    ...items.slice(0, cursor - 1),
                    newPreviousTask,
                    movedTask,
                    ...items.slice(cursor + 1)
                ];

                const isItemCreatedOnBackend = movedTask.etag;
                dispatch(actionCreators.moveDown(tasks));
                if (isItemCreatedOnBackend) {
                    RequestsEnqueuer.enqueue(() => GapiTasks.moveTask(
                        tasklist.id,
                        movedTask.id,
                        newPreviousTask.id
                    ));
                }
            }
            else if (!isEditingActive && cursor < items.length - (isListPickerExpanded ? 1 : 0)) {
                dispatch(actionCreators.scrollDown());
            }
        },

        13: async ({ ctrlKeyPressed, shiftKeyPressed }) => { // enter

            if (cursor === 0 && !ctrlKeyPressed && !shiftKeyPressed) {
                dispatch(actionCreators.toggleIsLoading());
                RequestsEnqueuer.enqueue(async () => {

                    const items = await GapiTasks.loadTasklists();
                    dispatch(actionCreators.loadTasklists(items));
                });
                return;
            }
            if (cursor > 0 && shiftKeyPressed  && items[cursor - 1].status === 'needsAction') {
                dispatch(actionCreators.toggleIsLoading());
                RequestsEnqueuer.enqueue(async () => {

                    const task = await GapiTasks.loadTask(tasklist.id, items[cursor - 1].id);
                    dispatch(actionCreators.expandTask(task));
                });
                return;
            }
            if (ctrlKeyPressed) {
                dispatch(actionCreators.insertItem());
                return;
            }
            if (
                items[cursor - 1]
                && items[cursor - 1].etag
                && items[cursor - 1].status === 'needsAction'
            ) {
                dispatch(actionCreators.editItem());
            }
        },

        46: async ({ ctrlKeyPressed }) => { // del

            if (cursor !== 0 && ctrlKeyPressed && items[cursor - 1].etag) {
                const updatedItems = items.filter((_, index) => index !== cursor - 1);
                dispatch(actionCreators.reloadItems(updatedItems, cursor - 1));
                RequestsEnqueuer.enqueue(() => GapiTasks.deleteTask(
                    tasklist.id, items[cursor - 1].id
                ));
            }
        },

        32: async ({ ctrlKeyPressed }) => { // space

            if (cursor === 0 || !ctrlKeyPressed) {
                return;
            }

            const updatedTask = items[cursor - 1];
            const previousTask = items[cursor - 2];

            updatedTask.status = updatedTask.status === 'needsAction'
                ? 'completed'
                : 'needsAction';
            const updatedItems = showCompleted
                ? SortTasks(items)
                : items.filter((item) => item.status === 'needsAction');
            dispatch(actionCreators.reloadItems(updatedItems));

            RequestsEnqueuer.enqueue(() => GapiTasks.updateTask(
                tasklist.id,
                updatedTask.id,
                updatedTask
            ));

            if (previousTask && previousTask.id) {
                RequestsEnqueuer.enqueue(() => GapiTasks.moveTask(
                    tasklist.id,
                    updatedTask.id,
                    previousTask && previousTask.id
                ));
            }
        },

        72: async ({ ctrlKeyPressed, shiftKeyPressed }) => { // h

            if (!ctrlKeyPressed && !shiftKeyPressed) {
                return;
            }

            if (showCompleted) {
                const onlyIncompleteTasks = items.filter((item) => item.status !== 'completed');
                dispatch(actionCreators.toggleShowCompleted(onlyIncompleteTasks));
            }
            else {
                dispatch(actionCreators.toggleIsLoading());
                RequestsEnqueuer.enqueue(async () => {

                    const tasks = await GapiTasks.loadTasks(tasklist.id, !showCompleted);
                    dispatch(actionCreators.toggleShowCompleted(SortTasks(tasks)));
                });
            }
        }
    };

    return (keydownEvent) => {

        const { keyCode, ctrlKey: ctrlKeyPressed, shiftKey: shiftKeyPressed } = keydownEvent;

        if (keyCode === 82 && !ctrlKeyPressed && shiftKeyPressed && hasErrored) { // r
            dispatch(actionCreators.resetState());
            return;
        }

        if (isLoading || hasErrored) {
            return;
        }

        if (keyCode === 27) { // esc
            keydownEvent.preventDefault();
            keydownEvent.target.blur();
            return;
        }

        if (keyCode === 73 && ctrlKeyPressed) { // I
            dispatch(actionCreators.toggleInstructions());
            return;
        }

        try {
            const ActiveActionsHash =
                isListPickerExpanded ? TasklistActionsByKeyCodeHash
                : isTaskExpanded ? TaskActionsByKeyCodeHash
                : TasksActionsByKeyCodeHash;
            ActiveActionsHash[keyCode] && ActiveActionsHash[keyCode]({
                ctrlKeyPressed, shiftKeyPressed
            });
        }
        catch (err) {
            dispatch(actionCreators.toggleHasErrored());
        }
    };
};

export default MakeKeydownListener;
