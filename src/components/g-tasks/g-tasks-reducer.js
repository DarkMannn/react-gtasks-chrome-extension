import { actionTypes } from './g-tasks-actions.js';

export const initialState = {
    isLoading: true,
    hasErrored: false,
    cursor: 0,
    items: [{ title: 'Loading...', id: '123' }],
    itemMaxLimit: 0,
    itemOffset: 0,
    tasklist: 'Loading...',
    task: {},
    navigationDir: 'down',
    showCompleted: true,
    isListPickerExpanded: true,
    isTaskExpanded: false,
    isAppFocused: false,
    isEditingActive: false,
    isNextBlurInsertion: false
}

export function gTasksReducer(state, action) {

    const actionsHash = {
        [actionTypes.resetState]: () => ({
            ...initialState,
            isAppFocused: true,
            itemMaxLimit: state.itemMaxLimit
        }),
        [actionTypes.toggleIsLoading]: () => ({
            ...state,
            isLoading: !state.isLoading
        }),
        [actionTypes.toggleHasErrored]: () => ({
            ...state,
            hasErrored: !state.hasErrored
        }),
        [actionTypes.toggleShowCompleted]: () => ({
            ...state,
            cursor: 0,
            itemOffset: 0,
            items: action.items,
            showCompleted: !state.showCompleted,
            isLoading: false
        }),
        [actionTypes.toggleAppFocus]: () => ({
            ...state,
            isAppFocused: !state.isAppFocused
        }),
        [actionTypes.toggleIsEditingActive]: () => ({
            ...state,
            isEditingActive: !state.isEditingActive
        }),
        [actionTypes.moveUp]: () => ({
            ...state,
            items: action.items,
            cursor: state.cursor - 1,
            navigationDir: 'up'
        }),
        [actionTypes.moveDown]: () => ({
            ...state,
            items: action.items,
            cursor: state.cursor + 1,
            navigationDir: 'down'
        }),
        [actionTypes.scrollUp]: () => ({
            ...state,
            cursor: state.cursor - 1,
            navigationDir: 'up'
        }),
        [actionTypes.scrollDown]: () => ({
            ...state,
            cursor: state.cursor + 1,
            navigationDir: 'down'
        }),
        [actionTypes.insertItem]: () => ({
            ...state,
            items: [{ title: '' }, ...state.items],
            isEditingActive: true,
            isNextBlurInsertion: true,
            cursor: state.isListPickerExpanded ? 0 : 1
        }),
        [actionTypes.reloadItems]: () => ({
            ...state,
            items: action.items,
            ...Number.isInteger(action.newCursor) && { cursor: action.newCursor },
            isNextBlurInsertion: false
        }),
        [actionTypes.editItem]: () => ({
            ...state,
            isEditingActive: true
        }),
        [actionTypes.expandTask]: () => ({
            ...state,
            task: action.task,
            items: [
                { title: action.task.title },
                { notes: action.task.notes },
                { due: action.task.due }
            ],
            isTaskExpanded: true,
            isLoading: false,
            cursor: state.isTaskExpanded ? state.cursor : 1
        }),
        [actionTypes.loadTasks]: () => ({
            ...state,
            items: action.items,
            tasklist: action.tasklist,
            task: {},
            isListPickerExpanded: false,
            isTaskExpanded: false,
            cursor: 1,
            itemOffset: 0,
            isLoading: false
        }),
        [actionTypes.replaceTask]: () => {

            const taskIndex = state.items.findIndex((item) => item.id === action.taskId);
            const updatedItems = state.items.map((item, index) =>
                index === taskIndex ? action.newTask : item
            );
            return {
                ...state,
                items: updatedItems
            };
        },
        [actionTypes.loadTasklists]: () => ({
            ...state,
            items: action.items,
            isListPickerExpanded: true,
            cursor: 0,
            itemOffset: 0,
            isLoading: false
        }),
        [actionTypes.resizeContent]: () => {

            const upperHeaderHeight = 95;
            const taskListNameHeight = 68;
            const taskItemHeight = 34;
            const twoArrowDivHeight = 26 + 27;
            const instructions =
                state.isListPickerExpanded ? 100
                : state.isTaskExpanded ? 64
                : 136;
            const availableHeightForTasks = action.windowHeight
                - upperHeaderHeight
                - taskListNameHeight
                - twoArrowDivHeight
                - instructions;
            const newItemMaxLimit = Math.floor(
                (availableHeightForTasks / taskItemHeight) - 1
            );

            return {
                ...state,
                itemMaxLimit: newItemMaxLimit,
                itemOffset: 0,
                cursor: action.keepCursor ? state.cursor : 0
            };
        },
        [actionTypes.calculateItemOffset]: () => {

            const {
                navigationDir, cursor, itemOffset, itemMaxLimit, isListPickerExpanded
            } = state;

            if ((navigationDir === 'down') && (cursor >= itemOffset + itemMaxLimit + 1)) {
                return {
                    ...state,
                    itemOffset: itemOffset + 1
                }
            }
            if (
                (navigationDir === 'up')
                && (cursor === itemOffset - (isListPickerExpanded ? 1 : 0))
                && (itemOffset !== 0)
            ) {
                return {
                    ...state,
                    itemOffset: itemOffset - 1
                }
            }
            return state;
        }
    };

    return actionsHash[action.type] ? actionsHash[action.type]() : state;
}
