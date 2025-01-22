import express from "express";
import {
  createBlogCategory,
  editBlogCategory,
  getAllCategories,
  tokenVarify,
  uploadBlogImage,
  deleteBlogImage,
  saveToDraft,
  publishDraft,
  unpublishBlog,
  getSingleBlog,
} from "../controllers/blogController.js";
import { imageupload, deleteimage } from "../middleware/imageController.js";

const router = express.Router();

router.post("/createcategory", createBlogCategory);

router.post("/editcategory", editBlogCategory);

router.get("/getallcategories", getAllCategories);

router.post("/save-to-draft", saveToDraft);
router.post("/publish-draft", publishDraft);
router.post("/unpublish-blog", unpublishBlog);

router.get("/getblog", getSingleBlog);

router.post("/upload-image", imageupload, uploadBlogImage);

router.delete("/delete-image", deleteimage, deleteBlogImage);

router.get("/tokenvarify", tokenVarify);

export default router;
