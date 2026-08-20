import type { Task } from "../../../shared/task.ts";

export type TaskResponse = {
    task: Task,
    message: string
};

export type ErrorMessage = {
    message: string
};