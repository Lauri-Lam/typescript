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
        };

    return (
        <>
            <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            />
            <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Description"
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
        </>
    )
};

export default AddTaskForm;