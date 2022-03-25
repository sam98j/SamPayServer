import express from "express";
import TransController from "../controllers/transactions";
import { validateClientMiddleware } from "../utils/VierfyClient";
const TransHandlers = new TransController()
const Router = express.Router()

// get the client that want to send money to him
Router.post("/transfer/get_receiver", validateClientMiddleware,TransHandlers.getReceiverHandler)
// submit money transfer
Router.post("/transfer/submit_transfer", validateClientMiddleware, TransHandlers.submitTransferHandler)

export default Router