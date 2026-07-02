import "./CourseDelegateRequest.css";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { usePreferenceTexts } from "../../../preferences/context/PreferencesContext.js";
import AppButton from "../../../../shared/ui/primitives/button/AppButton.jsx";
import EmptyText from "../../../../shared/ui/primitives/empty/EmptyText.jsx";
import type { Course, EntityId } from "../../../../shared/types/app.types.js";

interface DelegateCandidate {
    id: EntityId;
    code: string;
    name: string;
}

interface CourseDelegateRequestProps {
    course: Pick<Course, "id">;
    delegateCandidates?: DelegateCandidate[];
    handleRequestDelegate?: (payload: { courseId: EntityId; code: string }) => Promise<boolean>;
}

function CourseDelegateRequest({
    course,
    delegateCandidates = [],
    handleRequestDelegate
}: CourseDelegateRequestProps) {
    const { course: courseTexts } = usePreferenceTexts();
    const [delegateCode, setDelegateCode] = useState("");

    async function submitDelegateCandidate(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const wasCreated = await handleRequestDelegate?.({
            courseId: course.id,
            code: delegateCode
        });

        if (wasCreated) {
            setDelegateCode("");
        }
    }

    return (
        <form className="course-delegate-request" onSubmit={submitDelegateCandidate}>
            <h3>{courseTexts.delegateCandidates}</h3>

            <div className="course-delegate-request-form">
                <input
                    value={delegateCode}
                    placeholder={courseTexts.delegateCodePlaceholder}
                    onChange={(event) => setDelegateCode(event.target.value)}
                />

                <AppButton icon={UserPlus} type="submit" size="sm">
                    {courseTexts.addDelegate ?? ""}
                </AppButton>
            </div>

            <div className="course-delegate-candidates">
                {delegateCandidates.length === 0 && (
                    <EmptyText>{courseTexts.noDelegateCandidates}</EmptyText>
                )}

                {delegateCandidates.map((candidate) => (
                    <p key={candidate.id}>
                        <strong>{candidate.code}</strong>
                        <span>{candidate.name}</span>
                    </p>
                ))}
            </div>
        </form>
    );
}

export default CourseDelegateRequest;
