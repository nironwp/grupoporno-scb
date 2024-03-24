import express from "express"
import { getAllPlans } from "../controllers/plan.controller.ts";
import { cacheCore } from "../core/cache.ts";

const routerInstance = express.Router();

routerInstance.get('/list/all', cacheCore.cache.middleware(180, 'list-all-plans'),getAllPlans)

export {routerInstance}