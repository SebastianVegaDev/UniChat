import { OAuth2Client } from "google-auth-library";
import { env } from "../../../../config/env.js";
import { UnauthorizedError } from "../../../../errors/index.js";

const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const googleClient = new OAuth2Client(env.auth.googleClientId);

export async function verifyGoogleAccessToken(accessToken) {
    let tokenInfo;

    try {
        tokenInfo = await googleClient.getTokenInfo(accessToken);
    } catch {
        throw new UnauthorizedError("Invalid Google token");
    }

    if (tokenInfo.aud !== env.auth.googleClientId) {
        throw new UnauthorizedError("Invalid Google token");
    }

    if (!tokenInfo.email_verified) {
        throw new UnauthorizedError("Google email is not verified");
    }

    return tokenInfo;
}

export async function getGoogleUserProfile(accessToken) {
    const profileResponse = await fetch(GOOGLE_USERINFO_URL, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    if (!profileResponse.ok) {
        throw new UnauthorizedError("Invalid Google token");
    }

    return await profileResponse.json();
}