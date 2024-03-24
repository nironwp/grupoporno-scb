import express from 'express'
import { sendContactMailController } from "../controllers/mail.controller";
import { isAuthenticatedMiddleware } from '../middlewares/isAuthenticated.middleware';

const routerInstance = express.Router();

routerInstance.post('/contact', [isAuthenticatedMiddleware], sendContactMailController)


export { routerInstance };
