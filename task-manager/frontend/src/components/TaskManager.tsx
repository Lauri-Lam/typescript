import { useState, useEffect } from "react";
import type { TaskResponse, ErrorMessage } from "../types/task";
import type { Task, TaskPrio, AddTaskData, } from "../../../shared/task.ts";
import AddTaskForm from "./AddTaskForm";
import TaskFilter from "./TaskFilter";
import type { FilterType } from "./TaskFilter";
import ClearCompletedButton from "./ClearCompletedButton";
import TaskItem from "./TaskItem";

export default function TaskManager() {
    const [ tasks, setTasks ] = useState<Task[]>([]);
    const [ editingId, setEditingId ] = useState<number | null>(null);
    const [ editTitle, setEditTitle ] = useState("");
    const [ editPriority, setEditPriority ] = useState<TaskPrio>('medium');
    const [ editDescription, setEditDescription ] = useState("");
    const [ filter, setFilter ] = useState<FilterType>("all");
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

    let filteredTasks = tasks;
    if (filter === "active") {
        filteredTasks = tasks.filter(task => !task.completed);
    };

    if (filter === "completed") {
        filteredTasks = tasks.filter(task => task.completed);
    };

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
        try {
            if(editTitle.trim() === ""){
                setEditTitle("");
                setError("Empty title not allowed.")
                setTimeout(() => { setError(null) }, 3500);
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

            if (!response.ok) {
                const data: ErrorMessage = await response.json();
                setError(data.message);
                return;
            };

            const data: TaskResponse = await response.json();

            setTasks(currentTasks =>
                currentTasks.map(task => {
                    if(task.id === data.task.id){
                        return data.task;
                    }
                return task;
            }));

            setEditingId(null);
            setError(null);
        } catch {
            setError("No response from backend");
        };
    };

    const handleAddTask = async (data: AddTaskData) => {
        try {
            const response = await fetch("http://localhost:3000/tasks", {
            method: "POST",
            headers: { "Content-type": "application/json"},
            body: JSON.stringify(data)
            });

            if (!response.ok) {
                const responseData: ErrorMessage = await response.json();
                setError(responseData.message);
                setTimeout(() => {
                    setError(null);
                }, 3500);
                return;
            };

            const responseData: TaskResponse = await response.json();

            setTasks(currentTasks => [...currentTasks, responseData.task]);
            setError(null);
        } catch {
            setError("No response from backend");
        };
    };

    const handleCompleteTask = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: "PATCH",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    completed: true
                })
            });

            if (!response.ok) {
                const data: ErrorMessage = await response.json();
                setError(data.message);
                setTimeout(() => {
                    setError(null);
                }, 3500);
                return;
            }

            const data: TaskResponse = await response.json();

            setTasks(currentTasks =>
                currentTasks.map(task => {
                    if(task.id === data.task.id){
                        return data.task;
                    };
                    return task;
                }));
            setError(null);
        } catch {
            setError("No response from backend");
        };
    };

    const handleClearCompleted = async () => {
        try {
            const response = await fetch(`http://localhost:3000/tasks/completed`, {
            method: "DELETE"
            });
            if (!response.ok) {
                const data: ErrorMessage = await response.json();
                setError(data.message);
                setTimeout(() => {
                    setError(null);
                }, 3500);
                return
            };
            setTasks(currentTasks => currentTasks.filter(task => !task.completed));
            setError(null);
        } catch {
            setError("No response from backend");
        };
    };
    
    const handleDeleteTask = async (id: number) => {
        try {
            const response = await fetch(`http://localhost:3000/tasks/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const data: ErrorMessage = await response.json();
                setError(data.message);
                setTimeout(() => {
                    setError(null);
                }, 3500);
                return;
            };

            setTasks(currentTasks => currentTasks.filter(task => task.id !== id));
            setError(null);
        } catch {
            setError("No response from backend");
        };
    };

    useEffect(() => {
        const loadTasks = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:3000/tasks", {
                    method: "GET"
                });

                if (!response.ok) {
                    const data: ErrorMessage = await response.json();
                    setError(data.message);
                    setTimeout(() => {
                        setError(null);
                    }, 3500);
                    return;
                };

                const loadedTasks: Task[] = await response.json();

                setTasks(loadedTasks);
            } catch {
                setError("Failed to load tasks.");
            } finally {
                setLoading(false);
            }
        };
        loadTasks();
    }, []);
    
    return (
        <div>
            <h1>Task Manager</h1>
            <div>
                {error && <p>{error}</p>}
            </div>
            {loading && <p>Loading tasks...</p>}
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