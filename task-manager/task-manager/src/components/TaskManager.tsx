import { useState } from "react";
import type { Task, TaskPrio } from "../types/task";
import {
    completeTask,
    addTask,
    deleteTask,
    updateTask
} from "../services/taskService";

const TaskManager = () => {
    const [ tasks, setTasks ] = useState<Task[]>([
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
    const [ title, setTitle ] = useState("");
    const [ priority, setPriority ] = useState<TaskPrio>('medium');
    const [ editingId, setEditingId ] = useState<number | null>(null);
    const [ editTitle, setEditTitle ] = useState("");
    const [ editPriority, setEditPriority ] = useState<TaskPrio>('medium');

    const handleAddTask = () => {
        if (title.trim() === "") {
            setTitle("")
            return;
        }
        setTasks(addTask(tasks, {
            title: title.trim(),
            priority: priority
        }));
        setTitle("");
    };
    const handleStartEdit = (task: Task) => {
        setEditingId(task.id);
        setEditTitle(task.title);
        setEditPriority(task.priority);
    };
    const handleSaveEdit = (id: number) => {
        if (editTitle.trim() === "") {
            setEditTitle("");
            return;
        }
        setTasks(
            updateTask(tasks, id, {
                title: editTitle.trim(),
                priority: editPriority
            })
        );
        setEditingId(null);
    };
    
    return (
        <div>
            <h1>Task Manager</h1>
            <ul>
                { tasks.map(task => (
                    <li key={task.id}>
                        {editingId === task.id ? (
                            <>
                                <input
                                    value={editTitle}
                                    onChange={(event) => setEditTitle(event.target.value)}
                                />
                                <select
                                    value={editPriority}
                                    onChange={(event) => setEditPriority(event.target.value as TaskPrio)}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </>
                        ) : (
                            <>
                                {task.title} - {task.priority} - {task.completed ? 'Done' : 'Not done'}
                            </>
                        )} 
                        {!task.completed && editingId !== task.id && (
                            <button onClick={() => setTasks(completeTask(tasks, task.id))}>
                                Complete
                            </button>
                        )}
                        {editingId !== task.id && (
                            <button onClick={() => setTasks(deleteTask(tasks, task.id))}>
                                Delete
                            </button>
                        )}
                        {editingId === task.id ? (
                                <button onClick={() => handleSaveEdit(task.id)}>
                                    Save
                                </button>
                        ) : (
                                <button onClick={() => handleStartEdit(task)}>
                                    Edit
                                </button>
                        )}
                    </li>
                    ))}
            </ul>
            <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
            />
            <select
                value={priority}
                onChange={(event) => setPriority(event.target.value as TaskPrio)}
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <button onClick={handleAddTask}>
                Add Task
            </button>
        </div>
    )
};

export default TaskManager;