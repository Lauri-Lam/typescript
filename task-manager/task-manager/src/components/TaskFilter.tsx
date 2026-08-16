export type FilterType = "all" | "active" | "completed";

type TaskFilterProps = {
    onFilterChange: (filter: FilterType) => void;
}

const TaskFilter = ({ onFilterChange }: TaskFilterProps) => {
    return (
        <>
            <button onClick={() => onFilterChange("all")}>
                All
            </button>
            <button onClick={() => onFilterChange("active")}>
                Active
            </button>
            <button onClick={() => onFilterChange("completed")}>
                Completed
            </button>
        </>
    );
};

export default TaskFilter;