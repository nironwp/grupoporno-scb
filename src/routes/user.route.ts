import express from "express";

// Controllers
import {
  userDeleteController,
  userFetchAllController,
  userRefreshController,
  userUpdateController,
} from "../controllers/user.controller.ts";

// Middlewares
import { isAuthenticatedMiddleware } from "../middlewares/isAuthenticated.middleware.ts";
import { isAdminMiddleware } from "../middlewares/isAdmin.middleware.ts";

const routerInstance = express.Router();

routerInstance.patch(
  "/list/all",
  [isAuthenticatedMiddleware, isAdminMiddleware],
  userFetchAllController
);
routerInstance.delete(
  "/delete/:id",
  [isAuthenticatedMiddleware, isAdminMiddleware],
  userDeleteController
);
routerInstance.put(
  "/update/:id",
  [isAuthenticatedMiddleware, isAdminMiddleware],
  userUpdateController
);
routerInstance.get("/token/:token", userRefreshController);

export { routerInstance };
