
const MakeCustomGapiTasks = (gapiTasks) => ({

    loadTasklists: async () => ((await gapiTasks.tasklists.list()).result || {}).items,

    loadTasks: async (tasklist, showCompleted) => (
        (await gapiTasks.tasks.list({ tasklist, showCompleted, maxResults: 100 })).result || {}
    ).items,

    loadTask: async (tasklist, task) => (await gapiTasks.tasks.get({ tasklist, task })).result,

    createTask: (tasklist, body) => gapiTasks.tasks.insert({ tasklist }, body),

    moveTask: (tasklist, task, previous) => gapiTasks.tasks.move({ tasklist, task, previous }),

    updateTask: (tasklist, task, body) => gapiTasks.tasks.update({ tasklist, task }, body),

    deleteTask: (tasklist, task) => gapiTasks.tasks.delete({ tasklist, task })

});

export default MakeCustomGapiTasks;
