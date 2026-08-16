import express from "express";
import cors from "cors";


const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

const tasks = [
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
    const task = req.body;
    console.log(task);
    res.json(task);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});