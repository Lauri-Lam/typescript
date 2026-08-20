import type { Task, TaskPrio } from "../../../shared/task.ts";

type TaskItemProps = {
    task: Task;

    editingId: number | null;
    editTitle: string;
    editDescription: string;
    editPriority: TaskPrio;

    onEditTitleChange: (value: string) => void;
    onEditDescriptionChange: (value: string) => void;
    onEditPriorityChange: (value: TaskPrio) => void;

    onComplete: (id: number) => void;
    onDelete: (id: number) => void;
    onStartEdit: (task: Task) => void;
    onSaveEdit: (id: number) => void;
    onCancelEdit: () => void;
};

const TaskItem = ({
    task,
    editingId,
    editTitle,
    editDescription,
    editPriority,
    onEditTitleChange,
    onEditDescriptionChange,
    onEditPriorityChange,
    onComplete,
    onDelete,
    onStartEdit,
    onSaveEdit,
    onCancelEdit
}: TaskItemProps) => {
    return (
        <li>
            {editingId === task.id ? (
                <>
                    <input
                        value={editTitle}
                        onChange={(event) => onEditTitleChange(event.target.value)}
                    />
                    <input
                            value={editDescription}
                            onChange={(event) => onEditDescriptionChange(event.target.value)}
                    />
                    <select
                        value={editPriority}
                        onChange={(event) => onEditPriorityChange(event.target.value as TaskPrio)}
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </>
            ) : (
                <>
                    {task.description ? (
                        <>
                            {task.title} - {task.description} - {task.priority} - {task.completed ? 'Done' : 'Not done'}
                        </>
                    ) : (
                        <>
                            {task.title} - {task.priority} - {task.completed ? 'Done' : 'Not done'}
                        </>
                    )}
                </>
            )} 
            {!task.completed && editingId !== task.id && (
                <button onClick={() => onComplete(task.id)}>
                    Complete
                </button>
            )}
            {editingId !== task.id && (
                <button onClick={() => onDelete(task.id)}>
                    Delete
                </button>
            )}
            {editingId === task.id ? (
                    <>
                        <button onClick={onCancelEdit}>
                            Cancel
                        </button>
                        <button onClick={() => onSaveEdit(task.id)}>
                            Save
                        </button>
                    </>
            ) : (
                    <button onClick={() => onStartEdit(task)}>
                        Edit
                    </button>
            )}
        </li>
    );
};

export default TaskItem;