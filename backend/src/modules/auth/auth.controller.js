import { asyncHandler } from "../../shared/http/asyncHandler.js";
import { validateGoogleAuth, validateLogin, validateRegister } from "../../validators/auth.validator.js";
import { googleAuthUseCase } from "./application/googleAuth.usecase.js";
import { loginUseCase } from "./application/login.usecase.js";
import { registerUseCase } from "./application/register.usecase.js";

export const login = asyncHandler(async (req, res) => {
    const data = validateLogin(req.body);
    const session = await loginUseCase(data);

    res.json(session);
});

export const register = asyncHandler(async (req, res) => {
    const data = validateRegister(req.body);
    const user = await registerUseCase(data);

    res.json(user);
});

export const googleAuth = asyncHandler(async (req, res) => {
    const data = validateGoogleAuth(req.body);
    const session = await googleAuthUseCase(data);

    res.json(session);
});