import { ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import SectionLayout from "../../../shared/ui/layouts/section/SectionLayout.jsx";
import SectionHero from "../../../shared/ui/heroes/section/SectionHero.jsx";
import LoadingLayout from "../../../shared/ui/layouts/loading/LoadingLayout.jsx";
import NotFoundPage from "../../not-found/pages/NotFoundPage.jsx";
import AdminContent from "../components/AdminContent.jsx";
import { mapAdminData } from "../mappers/admin.mapper.js";
import { useBootstrap } from "../../bootstrap/hooks/useBootstrap.js";
import { usePreferenceTexts } from "../../preferences/context/PreferencesContext.js";
import {
    fetchAddAdminCourseUser,
    fetchApproveAdminDelegate,
    fetchBlockAdminUser,
    fetchCreateAdminAnnouncement,
    fetchCreateAdminCourse,
    fetchDeleteAdminAnnouncement,
    fetchDeleteAdminCourse,
    fetchRejectAdminDelegate,
    fetchUnblockAdminUser,
    fetchUpdateAdminAnnouncement,
    fetchUpdateAdminAnnouncementStatus,
    fetchUpdateAdminCourse
} from "../api/admin.api.js";
import {
    addAdminCourse,
    removeAdminAnnouncement,
    removeAdminCourseMember,
    removeAdminCourse,
    updateAdminCourse,
    updateAdminUser,
    upsertAdminAnnouncement,
    upsertAdminCourseMember
} from "../../bootstrap/updaters/bootstrap.updaters.js";

function AdminPage() {
    const { data, isLoading, error, updateBootstrap } = useBootstrap();
    const texts = usePreferenceTexts();

    if (isLoading) return <LoadingLayout />;
    if (error) return <p>{error}</p>;

    const adminData = mapAdminData(data, texts);

    if (adminData.currentUser?.role !== "admin") {
        return <NotFoundPage />;
    }

    async function handleCreateCourse(courseData) {
        try {
            const course = await fetchCreateAdminCourse(courseData);

            updateBootstrap((currentData) => addAdminCourse(currentData, course));
            toast.success("Curso creado");
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function handleUpdateCourse(courseId, courseData) {
        try {
            const course = await fetchUpdateAdminCourse(courseId, courseData);

            updateBootstrap((currentData) => updateAdminCourse(currentData, course));
            toast.success("Curso actualizado");
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function handleDeleteCourse(courseId) {
        try {
            await fetchDeleteAdminCourse(courseId);

            updateBootstrap((currentData) => removeAdminCourse(currentData, courseId));
            toast.success("Curso eliminado");
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function handleToggleUserBlock(userId, shouldBlock) {
        try {
            const updatedUser = shouldBlock
                ? await fetchBlockAdminUser(userId)
                : await fetchUnblockAdminUser(userId);

            updateBootstrap((currentData) => updateAdminUser(currentData, updatedUser));
            toast.success(shouldBlock ? "Usuario bloqueado" : "Usuario desbloqueado");
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function handleAddCourseUser(courseId, code) {
        try {
            const courseMember = await fetchAddAdminCourseUser(courseId, code);

            updateBootstrap((currentData) => upsertAdminCourseMember(currentData, courseMember));
            toast.success("Usuario agregado al curso");
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function handleApproveDelegate(courseId, userId) {
        try {
            const courseMember = await fetchApproveAdminDelegate(courseId, userId);

            updateBootstrap((currentData) => upsertAdminCourseMember(currentData, courseMember));
            toast.success("Delegado aprobado");
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function handleRejectDelegate(courseId, userId) {
        try {
            const courseMember = await fetchRejectAdminDelegate(courseId, userId);

            updateBootstrap((currentData) => removeAdminCourseMember(currentData, courseMember));
            toast.success("Postulación rechazada");
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function handleSaveAnnouncement(announcementId, announcementData) {
        try {
            const announcement = announcementId
                ? await fetchUpdateAdminAnnouncement(announcementId, announcementData)
                : await fetchCreateAdminAnnouncement(announcementData);

            updateBootstrap((currentData) => upsertAdminAnnouncement(currentData, announcement));
            toast.success("Noticia guardada");
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function handleUpdateAnnouncementStatus(announcementId, status) {
        try {
            const announcement = await fetchUpdateAdminAnnouncementStatus(announcementId, status);

            updateBootstrap((currentData) => upsertAdminAnnouncement(currentData, announcement));
            toast.success("Noticia actualizada");
        } catch (error) {
            toast.error(error.message);
        }
    }

    async function handleDeleteAnnouncement(announcementId) {
        try {
            await fetchDeleteAdminAnnouncement(announcementId);

            updateBootstrap((currentData) => removeAdminAnnouncement(currentData, announcementId));
            toast.success("Noticia eliminada");
        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <SectionLayout>
            <SectionHero
                eyebrow={<><ShieldCheck /> {texts.admin.eyebrow}</>}
                title={texts.admin.title}
                description={texts.admin.description}
            />
            <AdminContent
                adminData={adminData}
                handleCreateCourse={handleCreateCourse}
                handleAddCourseUser={handleAddCourseUser}
                handleApproveDelegate={handleApproveDelegate}
                handleDeleteAnnouncement={handleDeleteAnnouncement}
                handleDeleteCourse={handleDeleteCourse}
                handleRejectDelegate={handleRejectDelegate}
                handleSaveAnnouncement={handleSaveAnnouncement}
                handleToggleUserBlock={handleToggleUserBlock}
                handleUpdateAnnouncementStatus={handleUpdateAnnouncementStatus}
                handleUpdateCourse={handleUpdateCourse}
            />
        </SectionLayout>
    );
}

export default AdminPage;