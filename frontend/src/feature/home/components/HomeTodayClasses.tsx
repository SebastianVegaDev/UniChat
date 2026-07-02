import "./HomeTodayClasses.css";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";
import EmptyText from "../../../shared/ui/primitives/empty/EmptyText.jsx";
import HomeClassItem from "./HomeClassItem.jsx";

function HomeTodayClasses({ todayClasses }) {
    const { home } = usePreferenceTexts();

    return (
        <section className="home-today-classes">
            <div className="home-section-header">
                <h3>{home.classes}</h3>
                <span>{todayClasses.length}</span>
            </div>

            <div className="home-today-classes-list">
                {todayClasses.length === 0 && (
                    <EmptyText>No hay clases programadas para hoy.</EmptyText>
                )}

                {todayClasses.map((classItem) => (
                    <HomeClassItem key={classItem.id} classItem={classItem} />
                ))}
            </div>
        </section>
    );
}

export default HomeTodayClasses;