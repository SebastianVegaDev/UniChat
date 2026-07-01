import { createAuthSession } from "../domain/authSession.factory.js";
import { getUlimaEmailIdentity } from "../domain/ulimaEmail.js";
import { getGoogleUserProfile, verifyGoogleAccessToken } from "../infrastructure/google/googleAuth.client.js";
import { findUserByEmailOrCode, insertUser } from "../repositories/authUsers.repository.js";

export async function googleAuthUseCase({ accessToken }) {
    const tokenInfo = await verifyGoogleAccessToken(accessToken);
    const profile = await getGoogleUserProfile(accessToken);
    const { email, code } = getUlimaEmailIdentity(tokenInfo.email);

    let user = await findUserByEmailOrCode(email, code);

    if (!user) {
        user = await insertUser({
            firstName: profile.given_name || "User",
            lastName: profile.family_name || "",
            email,
            code,
            passwordHash: null
        });
    }

    return createAuthSession(user);
}