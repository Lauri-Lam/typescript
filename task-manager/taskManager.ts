type Task = {
    id: number,
    title: string,
    completed: boolean
};

const tasks: Task[] = [];

const addTask = (title: string) => {
    tasks.push({
        id: tasks.length + 1,
        title: title,
        completed: false
    });
};

const completeTask = (id: number) => {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = true;
    }
};