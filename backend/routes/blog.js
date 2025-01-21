import express from 'express';
import { createBlogCategory, editBlogCategory, getAllCategories, tokenVarify, uploadBlogImage, deleteBlogImage } from '../controllers/blogController.js';
import { imageupload, deleteimage } from '../middleware/imageController.js';

const router = express.Router();

router.post("/createcategory", createBlogCategory);

router.post("/editcategory", editBlogCategory);

router.get('/getallcategories', getAllCategories);

router.post('/upload-image', imageupload, uploadBlogImage);

router.delete('/delete-image', deleteimage, deleteBlogImage);

router.get('/tokenvarify', tokenVarify);


export default router;