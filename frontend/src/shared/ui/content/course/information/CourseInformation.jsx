import "./CourseInformation.css";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { usePreferenceTexts } from "../../../../../feature/preferences/context/PreferencesContext.js";

function CourseInformation({ currentUser, course: courseData, information, delegateCandidates = [], handleRequestDelegate }) {
    const { course } = usePreferenceTexts();
    const [delegateCode, setDelegateCode] = useState("");
    const isTeacher = currentUser?.role === "teacher";

    async function submitDelegateCandidate(event) {
        event.preventDefault();

        const wasCreated = await handleRequestDelegate?.({
            courseId: courseData.id,
            code: delegateCode
        });

        if (wasCreated) {
            setDelegateCode("");
        }
    }

    return (
        <div className="course-information">
            <p>{course.information}</p>
            <div className="course-information-week">
                <h3>{information.currentWeek}</h3>
                <h4>{course.currentWeek}</h4>
            </div>
            <div className="course-information-details">
                <div>
                    <h3>{course.professor}</h3>
                    <p>{information.professor}</p>
                </div>
                <div>
                    <h3>{course.delegates}</h3>
                    <p>{information.delegates}</p>
                </div>
                <div>
                    <h3>{course.activity}</h3>
                    <p>{information.activity}</p>
                </div>
            </div>
            {isTeacher && (
                <form className="course-information-delegates" onSubmit={submitDelegateCandidate}>
                    <h3>{course.delegateCandidates}</h3>
                    <div className="course-information-delegate-form">
                        <input
                            value={delegateCode}
                            placeholder={course.delegateCodePlaceholder}
                            onChange={(event) => setDelegateCode(event.target.value)}
                        />
                        <button type="submit">
                            <UserPlus />
                        </button>
                    </div>
                    <div className="course-information-candidates">
                        {delegateCandidates.length === 0 && <span>{course.noDelegateCandidates}</span>}
                        {delegateCandidates.map((candidate) => (
                            <p key={candidate.id}>
                                <strong>{candidate.code}</strong>
                                {candidate.name}
                            </p>
                        ))}
                    </div>
                </form>
            )}
        </div>
    );
}

export default CourseInformation;
