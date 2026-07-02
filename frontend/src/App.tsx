import { Routes, Route } from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppLayout from "./shared/app/layout/AppLayout.jsx";
import HomePage from "./feature/home/pages/HomePage.jsx";
import NewsPage from "./feature/news/pages/NewsPage.jsx";
import CoursePage from "./feature/course/pages/CoursePage.jsx";
import CourseCalendarPage from "./feature/course-calendar/pages/CourseCalendarPage.jsx";
import CourseChatPage from "./feature/course-chat/pages/CourseChatPage.jsx";
import AdminPage from "./feature/admin/pages/AdminPage.jsx";
import LoginPage from "./feature/auth/pages/LoginPage.jsx";
import RegisterPage from "./feature/auth/pages/RegisterPage.jsx";
import ProtectedRoute from "./shared/routes/ProtectedRoute.jsx";
import PublicRoute from "./shared/routes/PublicRoute.jsx";
import { BootstrapProvider } from "./feature/bootstrap/providers/BootstrapProvider.jsx";
import NotFoundPage from "./feature/not-found/pages/NotFoundPage.jsx";

function App() {
    return (
        <>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <RegisterPage />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <BootstrapProvider>
                                <AppLayout />
                            </BootstrapProvider>
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<HomePage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/news" element={<NewsPage />} />
                    <Route path="/course/:courseSlug/chat" element={<CourseChatPage />} />
                    <Route path="/course/:courseSlug/calendar" element={<CourseCalendarPage />} />
                    <Route path="/course/:courseSlug" element={<CoursePage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={3500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="dark"
                transition={Zoom}
            />
        </>
    );
}

export default App;
