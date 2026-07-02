import "./AiQuestionForm.css";
import { Send } from "lucide-react";
import IconButton from "../../../shared/ui/primitives/icon-button/IconButton.jsx";

function AiQuestionForm({ question, setQuestion, isLoading, submitQuestion }) {
    return (
        <form className="ai-question-form" onSubmit={submitQuestion}>
            <input
                className="ai-question-input"
                value={question}
                disabled={isLoading}
                placeholder="Pregunta por recursos, eventos o temas..."
                onChange={(event) => setQuestion(event.target.value)}
            />

            <IconButton
                icon={Send}
                label="Enviar"
                type="submit"
                size="md"
                variant="primary"
                disabled={isLoading}
            />
        </form>
    );
}

export default AiQuestionForm;