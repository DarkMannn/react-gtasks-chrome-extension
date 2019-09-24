import { actionCreators } from './g-tasks-actions.js';

const MakeKeydownListener = (
    {
        isLoading, hasErrored, items, cursor, tasklist, showCompleted,
        isEditingActive, isListPickerExpanded, isAppFocused
    },
    dispatch,
    GapiTasks
) => {

    const ActionsByKeyCodeHash = {

        '38': async ({ shiftKeyPressed }) => { // arrow up

            if (shiftKeyPressed) {

                const movedTask = items[cursor - 1];
                const newPreviousTask = items[cursor - 3];
                const isFirstItem = cursor === 1;
                if (isFirstItem) {
                    return;
                }
                await GapiTasks.moveTask(
                    tasklist.id,
                    movedTask.id,
                    newPreviousTask && newPreviousTask.id
                );
                const tasks = await GapiTasks.loadTasks(tasklist.id, showCompleted);
                dispatch(actionCreators.moveUp(tasks));
            }
            else if (!isEditingActive && cursor > 0) {
                dispatch(actionCreators.scrollUp());
            }
        },

        '40': async ({ shiftKeyPressed }) => { // arrow down

            if (shiftKeyPressed) {

                const movedTask = items[cursor - 1];
                const newPreviousTask = items[cursor];
                if (!newPreviousTask) {
                    return;
                }
                await GapiTasks.moveTask(tasklist.id, movedTask.id, newPreviousTask.id);
                const tasks = await GapiTasks.loadTasks(tasklist.id, showCompleted);
                dispatch(actionCreators.moveDown(tasks));
            }
            else if (!isEditingActive && cursor < items.length - (isListPickerExpanded ? 1 : 0)) {
                dispatch(actionCreators.scrollDown());
            }
        },

        '13': async ({ ctrlKeyPressed, shiftKeyPressed }) => { // enter

            if (isListPickerExpanded) {
                dispatch(actionCreators.toggleIsLoading());
                const currentTasklist = items[cursor];
                const tasks = await GapiTasks.loadTasks(currentTasklist.id, showCompleted);
                dispatch(actionCreators.loadTasks(tasks, currentTasklist));
                return;
            }
            if (cursor === 0 && !ctrlKeyPressed && !shiftKeyPressed) {
                dispatch(actionCreators.toggleIsLoading());
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

            updatedTask.status = updatedTask.status === 'needsAction'
                ? 'completed'
                : 'needsAction';
            await GapiTasks.updateTask(
                tasklist.id,
                updatedTask.id,
                updatedTask
            );
            if (previousTask && previousTask.id) {
                await GapiTasks.moveTask(
                    tasklist.id,
                    updatedTask.id,
                    previousTask && previousTask.id
                );
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

    return async ({ keyCode, ctrlKey: ctrlKeyPressed, shiftKey: shiftKeyPressed }) => {

        if (keyCode === 82 && !ctrlKeyPressed && shiftKeyPressed) { // r
            dispatch(actionCreators.resetState());
            return;
        }
        if (keyCode === 76 && ctrlKeyPressed && shiftKeyPressed) { // l
            dispatch(actionCreators.toggleAppFocus());
            return;
        }
        if (isAppFocused && !isLoading && !hasErrored && ActionsByKeyCodeHash[keyCode]) {
            try {
                await ActionsByKeyCodeHash[keyCode]({ ctrlKeyPressed, shiftKeyPressed });
            }
            catch (err) {
                dispatch(actionCreators.toggleHasErrored());
            }
        }
    };
};

export default MakeKeydownListener;
