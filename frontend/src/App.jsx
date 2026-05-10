import { Routes, Route } from "react-router-dom";
import AppLayout from "./shared/app/layout/AppLayout.jsx";
import HomePage from "./feature/home/pages/HomePage.jsx";
import NewsPage from "./feature/News/pages/NewsPage.jsx";
import CoursePage from "./feature/course/pages/CoursePage.jsx";
import CourseCalendarPage from "./feature/course-calendar/pages/CourseCalendarPage.jsx";
import CourseChatPage from "./feature/course-chat/pages/CourseChatPage.jsx";

function App() {

  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/news" element={<NewsPage />}/>
        <Route path="/course/:courseSlug/chat" element={<CourseChatPage />}/>
        <Route path="/course/:courseSlug/calendar" element={<CourseCalendarPage />}/>
        <Route path="/course/:courseSlug" element={<CoursePage />}/>
      </Route>
    </Routes>
  );
}

export default App;
