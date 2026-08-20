import express from "express";
import cors from "cors";
import type { Task, AddTaskData, UpdateTaskData } from "../../shared/task.ts"

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

let tasks: Task[] = [
    {
        id: 1,
        title: "Learn backend",
        completed: false,
        priority: "high"
    },
    {
        id: 2,
        title: "Connect React to API",
        completed: false,
        priority: "medium"
    }
];

app.get("/tasks", (req, res) => {
    // do error handling when cant get tasks from postgre
    res.json(tasks);
});

app.post("/tasks", (req, res) => {
    try {
        const { title, priority, description }: AddTaskData = req.body;
        const nextId = tasks.length === 0 ? 1 : Math.max(...tasks.map(task => task.id)) + 1;

        const newTask: Task = {
            id: nextId,
            title: title.trim(),
            priority: priority,
            ...(description?.trim() && { description: description.trim() }),
            completed: false
        }

        tasks.push(newTask);
        res.status(201).json({
            task: newTask,
            message: "Task created"
        });
    } catch {
        res.status(500).json({
            message: "Unexpected error"
        });
    };
});

app.patch("/tasks/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        const data: UpdateTaskData = req.body;

        const task: Task|undefined = tasks.find(task => task.id === id);

        if(!task){
            return res.status(404).json({ message: "Task not found."});
        };

        const updatedTask: Task = {
                    ...task,
                    ...data
                };

        if("description" in data &&
            data.description?.trim() === ""
        ) {
            delete updatedTask.description
        };

        tasks = tasks.map(task => {
            if(task.id === id){
                return updatedTask;
            }
            return task;
        });

        res.status(200).json({
            task: updatedTask,
            message: "Task updated"
        });
    } catch {
        res.status(500).json({message: "Unexpected error"})
    };
});

app.delete("/tasks/completed", (req, res) => {
    try {
        tasks = tasks.filter(task => task.completed === false);
        res.status(200).json();
    } catch {
        res.status(500).json({
            message: "Unexpected error"
        });
    };
});

app.delete("/tasks/:id", (req, res) => {
    try {
        const id = Number(req.params.id);

        const task: Task|undefined = tasks.find(task => task.id === id);

        if (!task) {
            res.status(404).json({
                message: "Task not found"
            });
            return;
        };

        tasks = tasks.filter(task => task.id !== id);

        res.status(200).json({
            message: `Task deleted`
        });
    } catch {
        res.status(500).json({
            message: `Unexpected error`
        })
    };
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});