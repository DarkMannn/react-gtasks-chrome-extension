
export const actionTypes = {
    resetState: 'RESET_STATE',
    toggleIsLoading: 'TOGGLE_IS_LOADING',
    toggleHasErrored: 'TOGGLE_HAS_ERRORED',
    toggleShowCompleted: 'TOGGLE_SHOW_COMPLETED',
    toggleIsEditingActive: 'TOGGLE_IS_EDITING_ACTIVE',
    moveUp: 'MOVE_UP',
    moveDown: 'MOVE_DOWN',
    scrollUp: "SCROLL_UP",
    scrollDown: "SCROLL_DOWN",
    insertItem: 'INSERT_ITEM',
    reloadItems: 'RELOAD_ITEMS',
    editItem: 'EDIT_ITEM',
    expandTask: 'EXPAND_TASK',
    loadTasks: 'LOAD_TASKS',
    replaceTask: 'REPLACE_TASK',
    loadTasklists: 'LOAD_TASKLISTS',
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
    toggleShowCompleted: (items) => ({
        type: actionTypes.toggleShowCompleted,
        items
    }),
    toggleIsEditingActive: () => ({
        type: actionTypes.toggleIsEditingActive
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
    insertItem: () => ({
        type: actionTypes.insertItem
    }),
    reloadItems: (items, newCursor) => ({
        type: actionTypes.reloadItems,
        items,
        newCursor
    }),
    editItem: () => ({
        type: actionTypes.editItem
    }),
    expandTask: (task) => ({
        type: actionTypes.expandTask,
        task
    }),
    loadTasks: (items, tasklist) => ({
        type: actionTypes.loadTasks,
        items,
        tasklist
    }),
    replaceTask: (newTask, taskId) => ({
        type: actionTypes.replaceTask,
        newTask,
        taskId
    }),
    loadTasklists: (items) => ({
        type: actionTypes.loadTasklists,
        items
    }),
    resizeContent: (windowHeight, keepCursor = false) => ({
        type: actionTypes.resizeContent,
        windowHeight,
        keepCursor
    }),
    calculateItemOffset: () => ({
        type: actionTypes.calculateItemOffset
    })
};
