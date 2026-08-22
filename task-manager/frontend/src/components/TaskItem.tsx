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
        <li className="list-group-item d-flex justify-content-between align-items-center">
            <div>
                {editingId === task.id ? (
                    <div className="d-flex gap-2 flex-grow-1 me-3">
                        <input
                            value={editTitle}
                            onChange={(event) => onEditTitleChange(event.target.value)}
                            className="form-control"
                        />
                        <input
                                value={editDescription}
                                onChange={(event) => onEditDescriptionChange(event.target.value)}
                                className="form-control"
                        />
                        <select
                            value={editPriority}
                            onChange={(event) => onEditPriorityChange(event.target.value as TaskPrio)}
                            className="form-select"
                        >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                ) : (
                    <div className="d-flex align-items-center gap-4 flex-grow-1">
                        <span className="text-primary">{task.title}</span>

                        {task.description && (
                            <span className="text-secondary">
                                {task.description}
                            </span>)}

                        <span className="badge text-bg-secondary">{task.priority}</span>

                        <span className="badge text-bg-light">{task.completed ? "Done" : "Not done"}</span>
                    </div>
                )} 
            </div>
            <div className="d-flex gap-2 flex-shrink-0">
                {!task.completed && editingId !== task.id && (
                    <button onClick={() => onComplete(task.id)} className="btn btn-success btn-sm">
                        Complete
                    </button>
                )}
                {editingId !== task.id && (
                    <button onClick={() => onDelete(task.id)} className="btn btn-danger btn-sm">
                        Delete
                    </button>
                )}
                {editingId === task.id ? (
                        <>
                            <button onClick={onCancelEdit} className="btn btn-outline-danger btn-sm">
                                Cancel
                            </button>
                            <button onClick={() => onSaveEdit(task.id)} className="btn btn-success btn-sm">
                                Save
                            </button>
                        </>
                ) : (
                        <button onClick={() => onStartEdit(task)} className="btn btn-outline-primary btn-sm">
                            Edit
                        </button>
                )}
            </div>
        </li>
    );
};

export default TaskItem;