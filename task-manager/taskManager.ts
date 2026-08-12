type TaskPrio = 'low' | 'medium' | 'high';

interface AddTaskData {
    title: string,
    priority: TaskPrio,
    description?: string
};

type Task = {
    id: number,
    title: string,
    completed: boolean,
    description?: string,
    priority: TaskPrio
};

let tasks: Task[] = [];

const addTask = (data: AddTaskData) => {
    const { title, priority, description } = data;
    tasks.push({
        id: tasks.length + 1,
        title: title,
        completed: false,
        description: description,
        priority: priority
    });
};

const completeTask = (id: number) => {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.completed = true;
    }
};

const getTask = (id: number) => {
    return tasks.find(task => task.id === id);
};

const deleteTask = (id: number) => {
    tasks = tasks.filter(task => task.id !== id);
};

const printDescription = (task: Task) => {
    if (task.description) { console.log(task.description); };
};

const getTasksByPriority = (priority: TaskPrio) => {
    return tasks.filter(task => task.priority === priority);
};

type UpdateTaskData = Partial<Omit<Task, 'id'>>;

const updateTask = (id: number, data: UpdateTaskData) => {
    const task = tasks.find(task => task.id === id);
    if (task) {
        Object.assign(task, data)
    };
};