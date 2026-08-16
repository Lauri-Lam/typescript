type ClearCompletedButtonProps = {
    onClearCompleted: () => void;
};

const ClearCompletedButton = ({ onClearCompleted }: ClearCompletedButtonProps) => {
    return (
        <div>
            <button onClick={onClearCompleted}>
                Clear Completed
            </button>
        </div>
    );
};

export default ClearCompletedButton;