import {
  authorize,
  login,
  me,
  register,
  verifyToken,
} from "@/auth/auth.controller";
import { authenticate } from "@/auth/auth.middleware";
import { Router } from "express";

const authRouter: Router = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.get("/me", authenticate, me);
authRouter.post("/authorize", authenticate, authorize);
authRouter.post("/verify-token", authenticate, verifyToken);

export default authRouter;
