
const sortTasks = (tasks = []) => tasks
    .sort((taskA, taskB) => parseInt(taskA.position) - parseInt(taskB.position))
    .reduce((acc, task) => {

        const queueToPush = task.status === 'needsAction' ? acc[0] : acc[1]
        queueToPush.push(task);
        return acc;
    }, [[/* pending */], [/* completed */]])
    .flat();

export default sortTasks;
