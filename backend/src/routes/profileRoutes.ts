import express from "express";
import { authMiddleware, AuthRequest } from "../middlewares/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, (req: AuthRequest, res) => {

  res.json({
    msg: "Profile data fetched successfully",
    user: req.user, 
  });
});

export default router;
