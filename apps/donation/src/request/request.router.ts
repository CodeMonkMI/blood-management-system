import { Router } from "express";
import {
  all,
  create,
  remove,
  single,
  update,
  verify,
} from "./request.controller";

const requestRouter: Router = Router();

requestRouter.get("/", all);
requestRouter.post("/", create);
requestRouter.get("/:id", single);
requestRouter.patch("/:id", update);
requestRouter.delete("/:id", remove);
requestRouter.patch("/:id/verify", verify);
export default requestRouter;
