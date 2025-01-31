import express from "express";
import {
  createBlogCategory,
  editBlogCategory,
  getAllCategories,
  tokenVarify,
  uploadBlogImage,
  deleteBlogImage,
  publishDraft,
  getSingleBlog,
  updateBlog,
} from "../controllers/blogController.js";
import { imageupload, deleteimage } from "../middleware/imageController.js";
import { authorization } from "../middleware/userMiddleware.js";

const router = express.Router();

router.get("/getallcategories", getAllCategories);

router.get("/getblog", getSingleBlog);

router.post("/upload-image", imageupload, uploadBlogImage);

router.delete("/delete-image", deleteimage, deleteBlogImage);

router.get("/tokenvarify", tokenVarify);


// Protected routes
router.use("/", authorization);

router.post("/createcategory", createBlogCategory);

router.post("/editcategory", editBlogCategory);

router.patch("/publish-draft", publishDraft);

router.patch("/updateBlog", updateBlog);



export default router;
