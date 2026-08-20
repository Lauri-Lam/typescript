import type { Task, AddTaskData, UpdateTaskData } from "../../../shared/task";

/*
NOTHING IN THIS FILE IS NEEDED AFTER BACKEND IS DONE
*/

export const addTask = (
    tasks: Task[],
    data: AddTaskData
) => {
    const { title, priority, description } = data;

    const nextId = tasks.length === 0 ? 1 : Math.max(...tasks.map(task => task.id)) + 1;

    const newTask: Task = {
        id: nextId,
        title: title.trim(),
        completed: false,
        ...(description?.trim() && { description: description.trim()}),
        priority: priority
    }

    return [
        ...tasks,
        newTask
    ]
};

export const completeTask = (
    tasks: Task[],
    id: number
) => {
    return tasks.map(task => {
        if(task.id === id) {
            return {
                ...task,
                completed: true
            }
        }
        return task
    })
};

export const deleteTask = (
    tasks: Task[],
    id: number
) => {
    return tasks.filter(task => task.id !== id);
};

export const updateTask = (
    tasks: Task[],
    id: number,
    data: UpdateTaskData
) => {
    return tasks.map(task => {
        if (task.id === id) {
            const updatedTask = {
                ...task,
                ...data
            };

            if ("description" in data &&
                data.description?.trim() === ""
            ) {
                delete updatedTask.description
            };

            return updatedTask;
        };
        return task;
    });
};