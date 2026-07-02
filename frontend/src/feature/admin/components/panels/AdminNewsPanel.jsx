import "./AdminNewsPanel.css";
import { Check, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import AppButton from "../../../../shared/ui/primitives/button/AppButton.jsx";
import StatusPill from "../../../../shared/ui/primitives/status/StatusPill.jsx";
import { getFormValues } from "../../helpers/adminForms.js";
import { findSelectedNews } from "../../helpers/adminSelectors.js";

function AdminNewsPanel({ adminData, handleDeleteAnnouncement, handleSaveAnnouncement, handleUpdateAnnouncementStatus }) {
    const { admin, common, news } = usePreferenceTexts();
    const [selectedNewsId, setSelectedNewsId] = useState(adminData.news[0]?.id ?? "new");
    const selectedNews = findSelectedNews(adminData.news, selectedNewsId);
    const isDraft = !selectedNews || selectedNews.status === "draft";
    const isPublished = selectedNews?.status === "published";
    const selectedNewsIdValue = selectedNews?.id ?? null;

    async function submitNews(event) {
        event.preventDefault();
        await handleSaveAnnouncement(selectedNewsIdValue, getFormValues(event));
    }

    return (
        <div className="admin-news-panel">
            <section className="admin-card admin-news-list-card">
                <div className="admin-card-header">
                    <h3>{admin.sections.news}</h3>
                    <AppButton icon={Plus} size="sm" variant="soft" onClick={() => setSelectedNewsId("new")}>
                        {admin.actions.newNews}
                    </AppButton>
                </div>

                <div className="admin-news-list">
                    {adminData.news.map((newsItem) => (
                        <button
                            key={newsItem.id}
                            type="button"
                            className={`admin-news-option ${selectedNews?.id === newsItem.id ? "active" : ""}`}
                            onClick={() => setSelectedNewsId(newsItem.id)}
                        >
                            <strong>{newsItem.title}</strong>
                            <span>{newsItem.categoryLabel} - {newsItem.publishedAt}</span>
                            <StatusPill type={newsItem.status}>
                                {newsItem.statusLabel}
                            </StatusPill>
                        </button>
                    ))}
                </div>
            </section>

            <section className="admin-card admin-news-editor-card">
                <form className="admin-news-form" key={selectedNews?.id ?? "new"} onSubmit={submitNews}>
                    <div className="admin-card-header">
                        <div>
                            <h3>{admin.labels.newsEditor}</h3>
                            <span>{selectedNews ? selectedNews.title : admin.actions.newNews}</span>
                        </div>
                    </div>

                    <label>
                        <span>{admin.labels.title}</span>
                        <input name="title" defaultValue={selectedNews?.title ?? ""} placeholder={news.untitled} />
                    </label>

                    <label>
                        <span>{admin.labels.body}</span>
                        <textarea name="body" defaultValue={selectedNews?.body ?? ""} placeholder={admin.empty.selectNews} />
                    </label>

                    <div className="admin-news-form-grid">
                        <label>
                            <span>{admin.labels.category}</span>
                            <select name="category" defaultValue={selectedNews?.category ?? "general"}>
                                <option value="academic">{news.categories.academic}</option>
                                <option value="campus">{news.categories.campus ?? "Campus"}</option>
                                <option value="systems">{news.categories.systems ?? "Systems"}</option>
                                <option value="general">{news.categories.general}</option>
                            </select>
                        </label>

                        <label>
                            <span>{admin.labels.status}</span>
                            <select name="status" defaultValue={selectedNews?.status ?? "draft"}>
                                <option value="draft">{admin.statusLabels.draft}</option>
                                <option value="published">{admin.statusLabels.published}</option>
                                <option value="archived">{admin.statusLabels.archived}</option>
                            </select>
                        </label>
                    </div>

                    <div className="admin-news-actions">
                        <AppButton icon={Check} type="submit">
                            {common.save}
                        </AppButton>

                        {selectedNews && isDraft && (
                            <AppButton
                                icon={Check}
                                variant="soft"
                                onClick={() => handleUpdateAnnouncementStatus(selectedNews.id, "published")}
                            >
                                {admin.actions.publishNews}
                            </AppButton>
                        )}

                        {selectedNews && isPublished && (
                            <AppButton
                                icon={Pencil}
                                variant="secondary"
                                onClick={() => handleUpdateAnnouncementStatus(selectedNews.id, "archived")}
                            >
                                {admin.actions.archiveNews}
                            </AppButton>
                        )}

                        {selectedNews && (
                            <AppButton
                                icon={Trash2}
                                variant="danger"
                                onClick={() => handleDeleteAnnouncement(selectedNews.id)}
                            >
                                {admin.actions.deleteNews}
                            </AppButton>
                        )}
                    </div>
                </form>
            </section>
        </div>
    );
}

export default AdminNewsPanel;