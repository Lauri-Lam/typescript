import { useState } from "react";
import type { AddTaskData, TaskPrio } from "../../../shared/task.ts";

type AddTaskFormProps = {
        onAdd: (data: AddTaskData) => void;
    };

const AddTaskForm = ({ onAdd }: AddTaskFormProps) => {
    const [ title, setTitle ] = useState("");
    const [ priority, setPriority ] = useState<TaskPrio>('medium');
    const [ description, setDescription ] = useState("");

    const handleAddTask = () => {
            if (title.trim() === "") {
                setTitle("")
                return;
            }
            onAdd({
                title: title.trim(),
                priority: priority,
                description: description.trim()
            });
            setTitle("");
            setDescription("");
            setPriority("medium");
        };

    return (
        <div className="d-flex gap-2 mb-4 align-items-center justify-content-center">
            <input
            value={title}
            placeholder="Title"
            onChange={(event) => setTitle(event.target.value)}
            className="form-control"
            />
            <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
                className="form-control"
            />
            <select
                value={priority}
                onChange={(event) => setPriority(event.target.value as TaskPrio)}
                className="form-select"
            >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>
            <button onClick={handleAddTask} className="btn btn-primary text-nowrap btn-sm">
                Add Task
            </button>
        </div>
    )
};

export default AddTaskForm;