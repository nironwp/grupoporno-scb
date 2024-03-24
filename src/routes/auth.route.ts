import express from "express";

// Controllers
import {
  authLoginController,
  authRegisterController,
} from "../controllers/auth.controller.ts";

const routerInstance = express.Router();

routerInstance.post("/register", authRegisterController);
routerInstance.post("/login", authLoginController);

export { routerInstance };
