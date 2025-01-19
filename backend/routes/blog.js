import express from 'express';
import { createBlogCategory, editBlogCategory, getAllCategories, tokenVarify } from '../controllers/blogController.js';

const router = express.Router();

router.post("/createcategory", createBlogCategory);

router.post("/editcategory", editBlogCategory);

router.get('/getallcategories', getAllCategories);

router.get('/tokenvarify', tokenVarify);


export default router;