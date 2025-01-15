import express from "express";

import { getUserByEmail, oAuthSignIn, register, signIn } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);

router.post("/signin", signIn);

router.post("/oauth-signin", oAuthSignIn);

router.get("/user/:email", getUserByEmail);

export default router;
