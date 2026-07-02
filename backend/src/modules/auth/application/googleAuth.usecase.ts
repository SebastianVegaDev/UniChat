import { createAuthSession } from "../domain/authSession.factory.js";
import { UnauthorizedError } from "../../../errors/index.js";
import { getUlimaEmailIdentity } from "../domain/ulimaEmail.js";
import { getGoogleUserProfile, verifyGoogleAccessToken } from "../infrastructure/google/googleAuth.client.js";
import { findUserByEmailOrCode, insertUser } from "../repositories/authUsers.repository.js";
import type { AuthSession } from "../types/auth.types.js";

export async function googleAuthUseCase({ accessToken }: { accessToken: string }): Promise<AuthSession> {
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

    if (!user) {
        throw new UnauthorizedError("Could not create Google user");
    }

    return createAuthSession(user);
}
