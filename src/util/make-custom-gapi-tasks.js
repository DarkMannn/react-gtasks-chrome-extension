
const MakeCustomGapiTasks = (gapiTasks) => ({

    loadTasklists: async () => ((await gapiTasks.tasklists.list()).result || {}).items,

    createTasklist: async (body) => (await gapiTasks.tasklists.insert(body)).result,

    updateTasklist: async (tasklist, body) => (
        await gapiTasks.tasklists.update({ tasklist }, body)
    ).result,

    deleteTasklist: async (tasklist) => (await gapiTasks.tasklists.delete({ tasklist })).result,

    loadTasks: async (tasklist, showCompleted) => (
        (await gapiTasks.tasks.list({ tasklist, showCompleted, maxResults: 100 })).result || {}
    ).items,

    loadTask: async (tasklist, task) => (await gapiTasks.tasks.get({ tasklist, task })).result,

    createTask: async (tasklist, body) => (await gapiTasks.tasks.insert({ tasklist }, body)).result,

    moveTask: async (tasklist, task, previous) => (
        await gapiTasks.tasks.move({ tasklist, task, previous })
    ).result,

    updateTask: async (tasklist, task, body) => (
        await gapiTasks.tasks.update({ tasklist, task }, body)
    ).result,

    deleteTask: async (tasklist, task) => (await gapiTasks.tasks.delete({ tasklist, task })).result

});

export default MakeCustomGapiTasks;
