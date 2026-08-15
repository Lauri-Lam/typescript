import { useState } from "react";
import type { Task } from "../types/task";
import {
    completeTask,
    addTask,
    deleteTask,
    updateTask
} from "../services/taskService";

const TaskManager = () => {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 1,
            title: "Learn React",
            completed: false,
            priority: "high"
        },
        {
            id: 2,
            title: "Build Task Manager",
            completed: false,
            priority: "medium"
        }
    ]);
    const [title, setTitle] = useState("")
    
    return (
        <div>
            <h1>Task Manager</h1>
            <ul>
                { tasks.map(task => (
                    <li key={task.id}>
                        {task.title} - {task.priority} - {task.completed ? 'Done' : 'Not done'}
                        <button onClick={() => setTasks(completeTask(tasks, task.id))}>
                            Complete
                        </button>
                        <button onClick={() => setTasks(deleteTask(tasks, task.id))}>
                            Delete
                        </button>
                    </li>
                    ))}
            </ul>
            <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            />
        </div>
    )
};

export default TaskManager;