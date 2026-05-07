import CourseLayout from "../../../shared/ui/layouts/course/CourseLayout.jsx";
import CourseHero from "../../../shared/ui/heroes/course/CourseHero.jsx";
import CourseContent from "../../../shared/ui/content/course/CourseContent.jsx";
import { course, actions, resourcesSummary, resourcesByWeek, information } from "../db/course.db.json";

function CoursePage() {
    return (
        <CourseLayout>
            <CourseHero 
                course={course}
            />    
            <CourseContent 
                actions={actions}
                resourcesSummary={resourcesSummary}
                resourcesByWeek={resourcesByWeek}
                information={information}
            />    
        </CourseLayout>
    );
}

export default CoursePage;