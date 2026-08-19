import express from "express";
import cors from "cors";


const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

let tasks = [
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
    res.json(tasks);
});

app.post("/tasks", (req, res) => {
    const { title, priority, description } = req.body;
    const nextId = tasks.length === 0 ? 1 : Math.max(...tasks.map(task => task.id)) + 1;

    const newTask = {
        id: nextId,
        title: title.trim(),
        priority: priority,
        ...(description?.trim() && { description: description.trim() }),
        completed: false
    }

    tasks.push(newTask);

    res.json(newTask);
});

app.patch("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if(!task){
        return res.status(404).json({ message: "Task not found."});
    };

    let updatedTask;
    tasks = tasks.map(task => {
        if(task.id === id){
            updatedTask = {
                ...task,
                ...req.body
            };

            if("description" in req.body &&
                req.body.description?.trim() === ""
            ) { delete updatedTask.description };

            return updatedTask;
        }
        return task;
    });

    res.json(updatedTask)
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
        const task = tasks.find(task => task.id === id);
        if (!task) {
            res.status(404).json({
                message: "Task not found"
            });
            return;
        };
        tasks = tasks.filter(task => task.id !== id);
        res.status(200).json({
            message: `Task "${task.title}" deleted succesfully`
        });
    } catch (error){
        res.status(500).json({
            message: `Unexpected error`
        })
    };
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});