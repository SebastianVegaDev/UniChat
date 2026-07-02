import { upsertAdminCourseMember } from "../../bootstrap/updaters/bootstrap.updaters.js";
import { fetchRequestDelegate } from "../api/courseDelegates.api.js";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../shared/types/app.types.js";

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
            toast.error(getErrorMessage(error));
        }

        return false;
    }

    return {
        handleRequestDelegate
    };
}
