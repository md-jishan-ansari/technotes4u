import express from 'express';
import userRouter from './auth.js';
import blogRouter from './blog.js';
import commentRouter from './comment.js';

const router = express.Router();

router.use('/auth', userRouter);

router.use('/blog', blogRouter);

router.use('/comment', commentRouter);

export default router;
