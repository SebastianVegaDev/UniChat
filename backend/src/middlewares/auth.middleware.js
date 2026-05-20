import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Token required" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Token required" });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            id: payload.id,
            role: payload.role
        };

        next()
    } catch {
        return res.status(401).json({ error: "Invalid or expirend token"})
    }
}

export function requireTeacher(role) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({
                message: "Forbidden"
            });
        }

        next();
    }
}
