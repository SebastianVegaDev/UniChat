import { loginService, registerService } from "./auth.service.js"

export async function login(req, res, next) {
    try {
        const code = req.body.code;
        const password = req.body.password;

        const session = await loginService({ code, password });

        res.json(session)

    } catch (error) {
        next(error)
    }

}
export async function register(req, res, next) {
    try {
        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;
        const repeatPassword = req.body.repeatPassword;

        if (password !== repeatPassword) {
            throw new Error("Passwords do not match");
        }

        const user = await registerService({
            firstName,
            lastName,
            email,
            password
        });

        res.json(user)
    } catch (error) {
        next(error);
    }

}