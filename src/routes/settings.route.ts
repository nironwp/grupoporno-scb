import express from "express";

// Controllers
import {
  settingsFetchAllController,
  settingsPatchController,
} from "../controllers/settings.controller.ts";

// Middlewares
import { isAuthenticatedMiddleware } from "../middlewares/isAuthenticated.middleware.ts";
import { isAdminMiddleware } from "../middlewares/isAdmin.middleware.ts";
import { cacheCore } from "../core/cache.ts";

const routerInstance = express.Router();

routerInstance.get("/list/all",cacheCore.cache.middleware(180, 'list-all-settings'),settingsFetchAllController);
routerInstance.patch(
  "/patch",
  [isAuthenticatedMiddleware, isAdminMiddleware],
  settingsPatchController,
);

export { routerInstance };
