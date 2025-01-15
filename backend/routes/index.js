import express from 'express';
import userRouter from './auth.js';
import blogRouter from './blog.js';

const router = express.Router();

router.use('/auth', userRouter);

router.use('/blog', blogRouter);

export default router;
