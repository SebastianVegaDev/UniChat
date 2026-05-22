import { loginService, registerService, googleAuthService } from "./auth.service.js"
import { validateLogin, validateRegister, validateGoogleAuth } from "../../validators/auth.validator.js";

export async function login(req, res, next) {
    try {
        const data = validateLogin(req.body);

        const session = await loginService(data);

        res.json(session)

    } catch (error) {
        next(error)
    }
}

export async function register(req, res, next) {
    try {
        const data = await validateRegister(req.body);

        const user = await registerService(data);

        res.json(user)
    } catch (error) {
        next(error);
    }
}

export async function googleAuth(req, res, next) {
    try {
        const data = await validateGoogleAuth(req.body);
        const session = await googleAuthService(data);

        res.json(session)
    } catch (error) {
        next(error);
    }
}
