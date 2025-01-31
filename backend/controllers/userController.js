import prisma from "../db/db.config.js";
import CatchAsync from "../utils/CatchAsync.js";


export const register = CatchAsync(async (req, res, next) => {
    const { name, email } = req.body;
    const user = await prisma.user.create({
        data: {
            name,
            email
        }
    });

    res.status(200).json({
        status: 'success',
        data: {
            user
        }
    });
});