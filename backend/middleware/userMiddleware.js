import CatchAsync from "../utils/CatchAsync.js";
import jwt from 'jsonwebtoken';

export const authorization = CatchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const authToken = authHeader && authHeader.split(' ')[1];

    const jwtSecret = process.env.JWT_SECRET;
    const decoded = jwt.verify(authToken || "", jwtSecret);

    if(!decoded || !decoded.id) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }

    req.userId = decoded.id;
    next();
});