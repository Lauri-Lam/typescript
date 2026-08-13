export type TaskPrio = 'low' | 'medium' | 'high';

export type UpdateTaskData = Partial<Omit<Task, 'id'>>;

export interface AddTaskData {
    title: string,
    priority: TaskPrio,
    description?: string
};

export type Task = {
    id: number,
    title: string,
    completed: boolean,
    description?: string,
    priority: TaskPrio
};
