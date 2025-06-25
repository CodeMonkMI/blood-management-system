import { Router } from "express";
import { all, create, single } from "./history.controller";

const historyRouter: Router = Router();

historyRouter.get("/", all);
historyRouter.post("/", create);
historyRouter.get("/:id", single);

export default historyRouter;
