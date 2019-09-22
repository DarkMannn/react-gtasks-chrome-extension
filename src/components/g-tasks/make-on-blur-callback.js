import { actionCreators } from './g-tasks-actions.js';

const MakeOnBlurCallback = (
    { items, cursor, tasklist, showCompleted, isNextBlurInsertion },
    dispatch,
    GapiTasks
) => async (newTitle) => {

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

export default MakeOnBlurCallback;
