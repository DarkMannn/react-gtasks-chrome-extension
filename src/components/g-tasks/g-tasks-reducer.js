import { actionTypes } from './g-tasks-actions.js';

export const initialState = {
    isLoading: true,
    hasErrored: false,
    cursor: 0,
    items: [{ title: 'Loading...', id: '123' }],
    itemMaxLimit: 0,
    itemOffset: 0,
    tasklist: 'Loading...',
    navigationDir: 'down',
    showCompleted: true,
    isListPickerExpanded: true,
    isItemExpanded: false,
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
        [actionTypes.createTask]: () => ({
            ...state,
            items: [{ title: '' }, ...action.items],
            isEditingActive: true,
            isNextBlurInsertion: true,
            cursor: 1
        }),
        [actionTypes.editTask]: () => ({
            ...state,
            isEditingActive: true
        }),
        [actionTypes.deleteTask]: () => ({
            ...state,
            items: action.items,
            cursor: 0
        }),
        [actionTypes.expandTask]: () => ({
            ...state,
            items: action.items,
            isItemExpanded: true
        }),
        [actionTypes.loadTasks]: () => ({
            ...state,
            items: action.items,
            tasklist: action.tasklist,
            isListPickerExpanded: false,
            cursor: 1,
            itemOffset: 0,
            isLoading: false
        }),
        [actionTypes.reloadTasks]: () => ({
            ...state,
            items: action.items,
            isNextBlurInsertion: false
        }),
        [actionTypes.loadTasklists]: () => ({
            ...state,
            items: action.items,
            isListPickerExpanded: true,
            cursor: 0,
            itemOffset: 0,
            isLoading: false
        }),
        [actionTypes.toggleShowCompleted]: () => ({
            ...state,
            items: action.items,
            showCompleted: !state.showCompleted
        }),
        [actionTypes.toggleAppFocus]: () => ({
            ...state,
            isAppFocused: !state.isAppFocused
        }),
        [actionTypes.toggleIsEditingActive]: () => ({
            ...state,
            isEditingActive: !state.isEditingActive
        }),
        [actionTypes.resizeContent]: () => {

            const upperHeaderHeight = action.windowHeight * 0.1;
            const taskListNameHeight = 68;
            const taskItemHeight = 36;
            const availableHeightForTasks = action.windowHeight
                - upperHeaderHeight
                - taskListNameHeight;
            const newItemMaxLimit = Math.floor(
                (availableHeightForTasks / taskItemHeight) - 1
            );

            return {
                ...state,
                itemMaxLimit: newItemMaxLimit,
                itemOffset: 0,
                cursor: 0
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
                && (cursor === itemOffset - (isListPickerExpanded ? 1 : 0)) && (itemOffset !== 0)
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
