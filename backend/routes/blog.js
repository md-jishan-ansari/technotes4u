import express from 'express';
import { createBlog, getAllCategories, tokenVarify } from '../controllers/blogController.js';

const router = express.Router();

router.post("/create", createBlog);

router.get('/getallcategories', getAllCategories);

router.get('/tokenvarify', tokenVarify);


export default router;