import { Router } from "express";
import {
  all,
  create,
  demote,
  getProfile,
  promote,
  remove,
  single,
  update,
  updateProfile,
  verify,
} from "./users.controller";

const usersRouter: Router = Router();

usersRouter.get("/", all);
usersRouter.post("/", create);
usersRouter.get("/:id", single);
usersRouter.patch("/:id", update);
usersRouter.delete("/:id", remove);

usersRouter.patch("/:id/verify", verify);
usersRouter.patch("/:id/promote", promote);
usersRouter.patch("/:id/demote", demote);

usersRouter.get("/:id/profile", getProfile);
usersRouter.patch("/:id/profile", updateProfile);

export default usersRouter;
