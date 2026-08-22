type ClearCompletedButtonProps = {
    onClearCompleted: () => void;
};

const ClearCompletedButton = ({ onClearCompleted }: ClearCompletedButtonProps) => {
    return (
        <div>
            <button onClick={onClearCompleted} className="btn btn-outline-danger">
                Clear Completed
            </button>
        </div>
    );
};

export default ClearCompletedButton;