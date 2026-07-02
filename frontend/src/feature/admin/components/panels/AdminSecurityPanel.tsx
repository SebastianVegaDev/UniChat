import "./AdminSecurityPanel.css";
import { Check, ShieldCheck, X } from "lucide-react";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import AppButton from "../../../../shared/ui/primitives/button/AppButton.jsx";
import EmptyText from "../../../../shared/ui/primitives/empty/EmptyText.jsx";
import StatusPill from "../../../../shared/ui/primitives/status/StatusPill.jsx";
import { getPendingDelegates } from "../../helpers/adminSelectors.js";

function AdminSecurityPanel({ adminData, handleApproveDelegate, handleRejectDelegate }) {
    const { admin } = usePreferenceTexts();
    const pendingDelegates = getPendingDelegates(adminData.courses);

    return (
        <div className="admin-security-panel">
            <section className="admin-card">
                <div className="admin-card-header">
                    <h3>{admin.labels.systemRules}</h3>
                </div>

                <div className="admin-rules-list">
                    {adminData.rules.map((rule) => (
                        <article className="admin-rule-item" key={rule}>
                            <span>
                                <ShieldCheck />
                            </span>
                            <p>{rule}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="admin-card">
                <div className="admin-card-header">
                    <div>
                        <h3>{admin.labels.pendingDelegates}</h3>
                        <span>{pendingDelegates.length} {admin.labels.pendingDelegates}</span>
                    </div>
                </div>

                <div className="admin-list">
                    {pendingDelegates.length === 0 && (
                        <EmptyText>{admin.empty.noPendingDelegates}</EmptyText>
                    )}

                    {pendingDelegates.map((delegate) => (
                        <article className="admin-list-row" key={`${delegate.courseId}-${delegate.id}`}>
                            <div className="admin-list-row-main">
                                <strong>{delegate.name}</strong>
                                <span>{delegate.courseTitle}</span>
                            </div>

                            <div className="admin-row-actions">
                                <StatusPill type={delegate.status}>
                                    {delegate.statusLabel}
                                </StatusPill>

                                <AppButton
                                    icon={Check}
                                    size="sm"
                                    variant="soft"
                                    onClick={() => handleApproveDelegate(delegate.courseId, delegate.id)}
                                >
                                    {admin.actions.approve}
                                </AppButton>

                                <AppButton
                                    icon={X}
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleRejectDelegate(delegate.courseId, delegate.id)}
                                >
                                    {admin.actions.reject}
                                </AppButton>
                            </div>
                        </article>
                    ))}
                </div>
            </section>
        </div>
    );
}

export default AdminSecurityPanel;