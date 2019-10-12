import { actionCreators } from './g-tasks-actions.js';
import * as RequestsEnqueuer from '../../util/requests-enqueuer.js';

const MakeOnBlurCallback = ({
    items, cursor, tasklist, task,
    isNextBlurInsertion, isListPickerExpanded, isTaskExpanded
}, dispatch, GapiTasks) =>
    isListPickerExpanded ? (newTitle) => { // tasklist callback

        dispatch(actionCreators.toggleIsEditingActive(false));

        // handle creation
        if (isNextBlurInsertion) {
            dispatch(actionCreators.toggleIsLoading());
            RequestsEnqueuer.enqueue(async (requestId) => {

                const createdTasklist = await GapiTasks.createTasklist({ title: newTitle });
                dispatch(actionCreators.reloadItems([createdTasklist, ...items.slice(1)]));
                dispatch(actionCreators.toggleIsLoading());
            });
            return;
        }

        // handle update
        const updatedTasklist = items[cursor];
        const shouldNotUpdate = updatedTasklist.title === newTitle;
        if (shouldNotUpdate) {
            return;
        }

        updatedTasklist.title = newTitle;
        dispatch(actionCreators.reloadItems(items));
        RequestsEnqueuer.enqueue(() => GapiTasks.updateTasklist(
            updatedTasklist.id, updatedTasklist
        ));
    }
    : isTaskExpanded ? (changedTaskProps) => { // zoomed task callback

        RequestsEnqueuer.enqueue(async () => {

            dispatch(actionCreators.toggleIsEditingActive(false));

            const shouldUpdate = Object.keys(changedTaskProps).some(
                (key) => task[key] !== changedTaskProps[key]
            );
            if (!shouldUpdate) {
                return;
            }
            const updatedTask = await GapiTasks.updateTask(
                tasklist.id, task.id, { ...task, ...changedTaskProps }
            );
            dispatch(actionCreators.expandTask(updatedTask));
        });
    }
    : (newTitle) => { // tasks callback

        dispatch(actionCreators.toggleIsEditingActive(false));

        // handle creation
        if (isNextBlurInsertion) {
            const requestId = RequestsEnqueuer.enqueue(async (requestId) => {

                const createdTask = await GapiTasks.createTask(tasklist.id, { title: newTitle });
                dispatch(actionCreators.replaceTask(createdTask, requestId));
            });
            const temporaryTask = { id: requestId, title: newTitle };
            const updatedItems = [temporaryTask, ...items.slice(1)];
            dispatch(actionCreators.reloadItems(updatedItems));
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
        dispatch(actionCreators.reloadItems(items));
        RequestsEnqueuer.enqueue(() => GapiTasks.updateTask(
            tasklist.id, updatedTask.id, updatedTask
        ));
        if (previousTask && previousTask.id) {
            RequestsEnqueuer.enqueue(() => GapiTasks.moveTask(
                tasklist.id, updatedTask.id, previousTask && previousTask.id
            ));
        }
    };

export default MakeOnBlurCallback;
