import express from "express";
import { addComment, getComments } from "../controllers/commentController.js";
import { authorization } from "../middleware/userMiddleware.js";


const router = express.Router();

router.get("/get-comments", getComments);

// Protected routes
router.use("/", authorization);

router.post("/add-comment", addComment);

export default router;
