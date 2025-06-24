import { authenticate } from "@/auth/auth.middleware";
import { authorize, login, me, register } from "@/request/donation.controller";
import { Router } from "express";

const authRouter: Router = Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.get("/me", authenticate, me);
authRouter.post("/authorize", authenticate, authorize);

export default authRouter;
