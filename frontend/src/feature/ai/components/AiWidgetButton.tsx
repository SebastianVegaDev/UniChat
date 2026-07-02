import "./AiWidgetButton.css";

function AiWidgetButton({ isOpen, openWidget, closeWidget }) {
    function toggleWidget() {
        if (isOpen) {
            closeWidget();
            return;
        }

        openWidget();
    }

    return (
        <button
            className="ai-widget-button"
            type="button"
            onClick={toggleWidget}
            title="Asistente IA"
        >
            <img src="/ia.png" alt="IA" />
        </button>
    );
}

export default AiWidgetButton;