import { actionCreators } from './g-tasks-actions.js';
import * as RequestsEnqueuer from '../../util/requests-enqueuer.js';

const MakeOnBlurCallback = (
    { items, cursor, tasklist, isNextBlurInsertion },
    dispatch,
    GapiTasks
) => (newTitle) => {

    dispatch(actionCreators.toggleIsEditingActive(false));

    // handle creation
    if (isNextBlurInsertion) {
        dispatch(actionCreators.toggleIsLoading());
        RequestsEnqueuer.enqueue(async () => {

            const createdTask = (await GapiTasks.createTask(tasklist.id, { title: newTitle })).result;
            const updatedItems = [createdTask, ...items.slice(1)];
            dispatch(actionCreators.toggleIsLoading());
            dispatch(actionCreators.reloadTasks(updatedItems));
        });
        return;
    }

    // handle update
    const updatedTask = items[cursor - 1];
    const previousTask = items[cursor - 2];

    const shouldNotUpdate = updatedTask.title === newTitle;
    if (shouldNotUpdate) {
        return;
    }

    updatedTask.title = newTitle;
    dispatch(actionCreators.reloadTasks(items));
    RequestsEnqueuer.enqueue(() => GapiTasks.updateTask(
        tasklist.id,
        updatedTask.id,
        updatedTask
    ));
    if (previousTask && previousTask.id) {
        RequestsEnqueuer.enqueue(() => GapiTasks.moveTask(
            tasklist.id, updatedTask.id, previousTask && previousTask.id
        ));
    }
};

export default MakeOnBlurCallback;
