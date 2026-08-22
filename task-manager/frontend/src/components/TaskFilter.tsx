export type FilterType = "all" | "active" | "completed";

type TaskFilterProps = {
    onFilterChange: (filter: FilterType) => void;
}

const TaskFilter = ({ onFilterChange }: TaskFilterProps) => {
    return (
        <>
            <button onClick={() => onFilterChange("all")} className="btn btn-outline-secondary">
                All
            </button>
            <button onClick={() => onFilterChange("active")} className="btn btn-outline-secondary">
                Active
            </button>
            <button onClick={() => onFilterChange("completed")} className="btn btn-outline-secondary">
                Completed
            </button>
        </>
    );
};

export default TaskFilter;