import "./HomeNextClassCard.css";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";
import AppButton from "../../../shared/ui/primitives/button/AppButton.jsx";
import EmptyText from "../../../shared/ui/primitives/empty/EmptyText.jsx";

function HomeNextClassCard({ nextClass }) {
    const navigate = useNavigate();
    const { home } = usePreferenceTexts();

    return (
        <section className="home-next-class-card">
            <div className="home-section-header">
                <h3>{home.nextClass}</h3>
            </div>

            {!nextClass && (
                <EmptyText>No hay una siguiente clase por ahora.</EmptyText>
            )}

            {nextClass && (
                <div className="home-next-class-card-body">
                    <h4>{nextClass.title}</h4>
                    <p>{nextClass.startTime} - {nextClass.endTime}</p>
                    <span>{nextClass.classroom} · {nextClass.teacher}</span>

                    <AppButton
                        icon={ArrowRight}
                        variant="primary"
                        onClick={() => navigate(nextClass.route)}
                    >
                        {home.openCourse}
                    </AppButton>
                </div>
            )}
        </section>
    );
}

export default HomeNextClassCard;