import { mercadoPagoNotify } from "../controllers/notify.controller.ts";

import express from 'express'

const routerInstance = express.Router();

routerInstance.post('/mercadopago', mercadoPagoNotify)

export {routerInstance}