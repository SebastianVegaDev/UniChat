import { upsertAdminCourseMember } from "../../bootstrap/updaters/bootstrap.updaters.js";
import { fetchRequestDelegate } from "../api/courseDelegates.api.js";
import { toast } from "react-toastify";

export function useCourseDelegateActions({ updateBootstrap }) {
    async function handleRequestDelegate(delegateData) {
        try {
            const courseMember = await fetchRequestDelegate(delegateData);

            if (courseMember) {
                updateBootstrap((currentData) => upsertAdminCourseMember(currentData, courseMember));
                toast.success("Postulacion enviada");

                return true;
            }
        } catch (error) {
            toast.error(error.message);
        }

        return false;
    }

    return {
        handleRequestDelegate
    };
}
