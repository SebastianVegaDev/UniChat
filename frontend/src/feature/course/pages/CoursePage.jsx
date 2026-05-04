import CourseLayout from "../../../shared/ui/layouts/course/CourseLayout.jsx";
import CourseHero from "../../../shared/ui/heroes/course/CourseHero.jsx";
import CourseContent from "../../../shared/ui/content/course/CourseContent.jsx";

function CoursePage() {
    return (
        <CourseLayout>
            <CourseHero />    
            <CourseContent />    
        </CourseLayout>
    );
}

export default CoursePage;