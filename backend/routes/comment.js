import express from "express";
import { addComment, getComments, getReplies } from "../controllers/commentController.js";
import { authorization } from "../middleware/userMiddleware.js";


const router = express.Router();

router.get("/get-comments", getComments);

router.get("/get-replies", getReplies);

// Protected routes
router.use("/", authorization);

router.post("/add-comment", addComment);

export default router;
