import { Request, Response } from "express";
import { ClientFailure, TransactionErr } from "../interfaces/enums";
import { GetReceiverBody, SubmitTransBody, SubmitTransPrams } from "../interfaces/trans";
import ClientsServices from '../services/clients';
const clientsServices = new ClientsServices();
import TransServices from '../services/transactions';
const transactionsService = new TransServices()

export default class TransController {
    // get reciver handler
    getReceiverHandler = async(req: Request, res: Response) => {
        // receiver phone
        const {receiverPhone} = req.body as GetReceiverBody;
        try {
            const client = await clientsServices.getReceiver(receiverPhone);
            if(client === ClientFailure.CLIENT_NOT_EXIST) {
                const resObj = {err: "client dosnot exist"}
                res.status(400).send(resObj)
                return
            }
            const resObj = client
            res.status(200).send(resObj)
        } catch(err) {
            res.status(500).send({msg: "internal serveer error", err})
        }
    }
    // submit transfer
    async submitTransfer(req: Request, res: Response){
        // transaction amount and receiver phone number
        const {amount, receiverPhone} = req.body as SubmitTransBody;
        // submit transaction params
        const submitTransPrams = {
            amount, 
            receiverPhone,
            client_id: req.currentClient! 
        } as SubmitTransPrams
        // 
        try {
            const submitTransRes = await transactionsService.submitTransfer(submitTransPrams);
            res.send(submitTransRes)
        } catch(err) {
            // enums
            const {UN_SUFFICENT_FUND} = TransactionErr;
            const {CLIENT_NOT_EXIST} = ClientFailure;
            // if client not exist
            if(err === CLIENT_NOT_EXIST) {
                res.status(400).send(CLIENT_NOT_EXIST)
                return
            }
            // un_sufficent balance
            if(err === UN_SUFFICENT_FUND) {
                res.status(400).send(UN_SUFFICENT_FUND)
                return
            }
            res.status(500).send(err)
        }
    }
}