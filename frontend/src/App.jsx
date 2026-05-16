import { Routes, Route } from "react-router-dom";
import AppLayout from "./shared/app/layout/AppLayout.jsx";
import HomePage from "./feature/home/pages/HomePage.jsx";
import NewsPage from "./feature/News/pages/NewsPage.jsx";
import CoursePage from "./feature/course/pages/CoursePage.jsx";
import CourseCalendarPage from "./feature/course-calendar/pages/CourseCalendarPage.jsx";
import CourseChatPage from "./feature/course-chat/pages/CourseChatPage.jsx";
import LoginPage from "./feature/auth/pages/LoginPage.jsx";
import RegisterPage from "./feature/auth/pages/RegisterPage.jsx";
import ProtectedRoute from "./shared/routes/ProtectedRoute.jsx";

function App() {

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />}/>
      <Route path="/register" element={<RegisterPage />}/>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
        <Route index element={<HomePage />}/>
        <Route path="/news" element={<NewsPage />}/>
        <Route path="/course/:courseSlug/chat" element={<CourseChatPage />}/>
        <Route path="/course/:courseSlug/calendar" element={<CourseCalendarPage />}/>
        <Route path="/course/:courseSlug" element={<CoursePage />}/>
      </Route>
    </Routes>
  );
}

export default App;
