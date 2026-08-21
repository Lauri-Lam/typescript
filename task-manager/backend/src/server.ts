import express from "express";
import cors from "cors";
import type { Task, AddTaskData, UpdateTaskData } from "../../shared/task.ts";
import pool from "./db.js";

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/tasks", async (req, res) => {
    try {
        const result = await pool.query<Task>("SELECT * FROM tasks");
        res.json(result.rows);
    } catch {
        res.status(500).json({
            message: "Backend error"
        });
    };
});

app.post("/tasks", async (req, res) => {
    try {
        const { title, priority, description }: AddTaskData = req.body;
        
        const result = await pool.query<Task>(
            "INSERT INTO tasks (title, priority, description) VALUES ($1, $2, $3) RETURNING *", [title, priority, description]);

        res.status(201).json({
            task: result.rows[0],
            message: "Task created"
        });
    } catch {
        res.status(500).json({
            message: "Backend error"
        });
    };
});

app.patch("/tasks/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const data: UpdateTaskData = req.body;

        const selectResult = await pool.query<Task>("SELECT * FROM tasks WHERE id = $1", [id]);

        const task: Task|undefined = selectResult.rows[0];

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

        const updateResult = await pool.query<Task>("UPDATE tasks SET title = $1, priority = $2, completed = $3, description = $4 WHERE id = $5 RETURNING *",
            [updatedTask.title, updatedTask.priority, updatedTask.completed, updatedTask.description ?? null, id]);

        res.status(200).json({
            task: updateResult.rows[0],
            message: "Task updated"
        });
    } catch {
        res.status(500).json({message: "Backend error"})
    };
});

app.delete("/tasks/completed", async (req, res) => {
    try {
        await pool.query("DELETE FROM tasks WHERE completed = true");
        res.status(200).json();
    } catch {
        res.status(500).json({
            message: "Backend error"
        });
    };
});

app.delete("/tasks/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const result = await pool.query<Task>("DELETE FROM tasks WHERE id = $1 RETURNING *", [id]);

        const task: Task|undefined = result.rows[0];

        if (!task) {
            res.status(404).json({
                message: "Task not found"
            });
            return;
        };

        res.status(200).json({
            message: `Task deleted`
        });
    } catch {
        res.status(500).json({
            message: `Backend error`
        })
    };
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});