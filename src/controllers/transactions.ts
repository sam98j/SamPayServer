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
        // receiver phone or email
        const {receiverContact} = req.body as GetReceiverBody;
        try {
            // get receiver
            const client = await clientsServices.getReceiver({receiverContact, currentClientId: req.currentClient!});
            // check if receiver is not exist
            if(client === ClientFailure.CLIENT_NOT_EXIST) {
                const resObj = {err: "client dosnot exist"}
                res.status(400).send(resObj)
                return
            }
            // check if r.client and c.client are the same
            if(client === ClientFailure.SAME_RECEIVER_AND_CURRENT) {
                const resObj = {err: "You Can't send to your self"};
                res.status(400).send(resObj);
                return
            }
            // there is no error
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