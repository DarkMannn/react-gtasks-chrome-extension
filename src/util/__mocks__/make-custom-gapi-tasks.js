
const MakeCustomGapiTasks = (gapiTasks) => ({

    loadTasklists: () => Promise.resolve(
        ['tasklist0', 'tasklist1', 'tasklist2'].map((tasklist) => ({ title: tasklist }))
    ),

    createTasklist: () => {},

    updateTasklist: () => {},

    deleteTasklist: () => {},

    loadTasks: async () => Promise.resolve(
        ['task0', 'task1', 'task2', 'task3', 'task4'].map((task) => ({
            title: task, status: 'needsAction', etag: 't'
        }))
    ),

    loadTask: async () => Promise.resolve({
        id: 1, title: 'title', status: 'needsAction', notes: 'notes', due: '2011-11-11'
    }),

    createTask: () => {},

    moveTask: () => {},

    updateTask: () => {},

    deleteTask: () => {}

});

export default MakeCustomGapiTasks;
