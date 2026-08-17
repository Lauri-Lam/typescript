import { useState, useEffect } from "react";
import type { Task, TaskPrio, AddTaskData } from "../types/task";
import {
    deleteTask,
} from "../services/taskService";
import AddTaskForm from "./AddTaskForm";
import TaskFilter from "./TaskFilter";
import type { FilterType } from "./TaskFilter";
import ClearCompletedButton from "./ClearCompletedButton";
import TaskItem from "./TaskItem";

const TaskManager = () => {
    const [ tasks, setTasks ] = useState<Task[]>([]);
    const [ editingId, setEditingId ] = useState<number | null>(null);
    const [ editTitle, setEditTitle ] = useState("");
    const [ editPriority, setEditPriority ] = useState<TaskPrio>('medium');
    const [ editDescription, setEditDescription ] = useState("");
    const [ filter, setFilter ] = useState<FilterType>("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleStartEdit = (task: Task) => {
        setEditingId(task.id);
        setEditTitle(task.title);
        setEditPriority(task.priority);
        setEditDescription(task.description ?? "");
    };
    const handleCancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
        setEditDescription("");
        setEditPriority("medium");
        setError(null);
    };
    const handleSaveEdit = async (id: number) => {
        if(editTitle.trim() === ""){
            setEditTitle("");
            setError("Empty title not allowed.")
            return;
        };

        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "PATCH",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                title: editTitle.trim(),
                priority: editPriority,
                description: editDescription.trim()
            })
        });

        const updatedTask: Task = await response.json();

        setTasks(tasks.map(task => {
            if(task.id === updatedTask.id){
                return updatedTask;
            }
            return task;
        }));
        setEditingId(null);
        setError(null);
    };
    const handleAddTask = async (data: AddTaskData) => {
        const response = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: { "Content-type": "application/json"},
            body: JSON.stringify(data)
        });

        const newTask: Task = await response.json();
        setTasks([...tasks, newTask]);
    };
    const handleCompleteTask = async (id: number) => {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "PATCH",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({
                completed: true
            })
        });

        const updatedTask: Task = await response.json();

        setTasks(tasks.map(task => {
            if(task.id === updatedTask.id){
                return updatedTask;
            };
            return task;
        }));
    };
    const handleClearCompleted = () => {
        const newTasks = tasks.filter(task => !task.completed);
        setTasks(newTasks);
    };
    const handleDeleteTask = (id: number) => {
        setTasks(deleteTask(tasks, id))
    };

    let filteredTasks = tasks;
    if (filter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    };
    if (filter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    };

    useEffect(() => {
        const loadTasks = async () => {
            setError(null);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000));
                const response = await fetch("http://localhost:3000/tasks");

                if (!response.ok) 
                    throw new Error(`Failed to load tasks. Error: ${response.status}`)

                const loadedTasks: Task[] = await response.json();

                setTasks(loadedTasks);
            } catch (error){
                if(error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Failed to load tasks.");
                }
            } finally {
                setLoading(false);
            }
        };
        loadTasks();
    }, []);
    
    return (
        <div>
            <h1>Task Manager</h1>
            {loading && <p>Loading tasks...</p>}
            {error && <p>{error}</p>}
            <ClearCompletedButton onClearCompleted={handleClearCompleted} />
            <TaskFilter onFilterChange={setFilter} />
            <ul>
                {filteredTasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        editingId={editingId}
                        editTitle={editTitle}
                        editDescription={editDescription}
                        editPriority={editPriority}
                        onEditTitleChange={setEditTitle}
                        onEditDescriptionChange={setEditDescription}
                        onEditPriorityChange={setEditPriority}
                        onComplete={handleCompleteTask}
                        onDelete={handleDeleteTask}
                        onStartEdit={handleStartEdit}
                        onSaveEdit={handleSaveEdit}
                        onCancelEdit={handleCancelEdit}
                    />
                ))}
            </ul>
            <AddTaskForm onAdd={handleAddTask} />
        </div>
    )
};

export default TaskManager;