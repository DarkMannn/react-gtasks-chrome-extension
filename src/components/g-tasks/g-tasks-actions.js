
export const actionTypes = {
    resetState: 'RESET_STATE',
    toggleIsLoading: 'TOGGLE_IS_LOADING',
    toggleHasErrored: 'TOGGLE_HAS_ERRORED',
    moveUp: 'MOVE_UP',
    moveDown: 'MOVE_DOWN',
    scrollUp: "SCROLL_UP",
    scrollDown: "SCROLL_DOWN",
    createTask: 'CREATE_TASK',
    editTask: 'EDIT_TASK',
    deleteTask: 'DELETE_TASK',
    expandTask: 'EXPAND_TASK',
    loadTasks: 'LOAD_TASKS',
    reloadTasks: 'RELOAD_TASKS',
    loadTasklists: 'LOAD_TASKLISTS',
    toggleShowCompleted: 'TOGGLE_SHOW_COMPLETED',
    toggleAppFocus: 'TOGGLE_APP_FOCUS',
    toggleIsEditingActive: 'TOGGLE_IS_EDITING_ACTIVE',
    resizeContent: 'RESIZE_CONTENT',
    calculateItemOffset: 'CALCULATE_ITEM_OFFSET'
}

export const actionCreators = {
    resetState: () => ({
        type: actionTypes.resetState
    }),
    toggleIsLoading: () => ({
        type: actionTypes.toggleIsLoading
    }),
    toggleHasErrored: () => ({
        type: actionTypes.toggleHasErrored
    }),
    moveUp: (items) => ({
        type: actionTypes.moveUp,
        items
    }),
    moveDown: (items) => ({
        type: actionTypes.moveDown,
        items
    }),
    scrollUp: () => ({
        type: actionTypes.scrollUp
    }),
    scrollDown: () => ({
        type: actionTypes.scrollDown
    }),
    createTask: (items) => ({
        type: actionTypes.createTask,
        items
    }),
    deleteTask: (items) => ({
        type: actionTypes.deleteTask,
        items
    }),
    editTask: () => ({
        type: actionTypes.editTask
    }),
    expandTask: (items) => ({
        type: actionTypes.expandTask,
        items
    }),
    loadTasks: (items, tasklist) => ({
        type: actionTypes.loadTasks,
        items,
        tasklist
    }),
    reloadTasks: (items) => ({
        type: actionTypes.reloadTasks,
        items
    }),
    loadTasklists: (items) => ({
        type: actionTypes.loadTasklists,
        items
    }),
    toggleShowCompleted: (items) => ({
        type: actionTypes.toggleShowCompleted,
        items
    }),
    toggleAppFocus: () => ({
        type: actionTypes.toggleAppFocus,
    }),
    toggleIsEditingActive: () => ({
        type: actionTypes.toggleIsEditingActive
    }),
    resizeContent: (windowHeight) => ({
        type: actionTypes.resizeContent,
        windowHeight
    }),
    calculateItemOffset: () => ({
        type: actionTypes.calculateItemOffset
    })
};
