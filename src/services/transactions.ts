import { SocketIoInstance } from '..';
import { Client, UpdateTransHistoryParams } from '../interfaces/clients.services';
import { ClientFailure, TransactionErr } from '../interfaces/enums';
import { CompleteTransPrams, SubmitTransPrams, SubmitTransRes } from '../interfaces/trans';
import ClientsServices from '../services/clients';
const clientsServices = new ClientsServices()


export default class TransServices {
    // submit transfer
    completeTransfer = ({_id, receiverId, amount}: CompleteTransPrams): Promise<any[]> => {
      return new Promise(async(resolve, reject) => {
        // take the money from current client
        try {
          // takeing Money
          await clientsServices.updateClientBalance({_id, operation: false, amount})
          // try to add moeny to receiver client
          await clientsServices.updateClientBalance({_id: receiverId, amount, operation: true});
          // update trans history params
          const updateTransHisParams = {
            _id,
            amount,
            receiverId
          } as UpdateTransHistoryParams;
          // promise .all
          const data = await Promise.all([clientsServices.updateTransHis(updateTransHisParams), clientsServices.getClientBalance(_id)])
          resolve(data)
        } catch(err) {reject("error in making transaction")}
      })
    }
    // submit transfer
    submitTransfer = ({client_id, receiverContact, amount}: SubmitTransPrams) => {
      // transfer details comes from client
      return new Promise(async(resolve, reject) => {
        // GetReceiver errors
        const {CLIENT_NOT_EXIST, SAME_RECEIVER_AND_CURRENT} = ClientFailure;
        // Transactions Errors
        const {UN_SUFFICENT_FUND} = TransactionErr;
        try {
          // get the current client balance
          const clientBalance = await clientsServices.getClientBalance(client_id);
          // client dosn't exist
          if(clientBalance === CLIENT_NOT_EXIST) {
            reject(CLIENT_NOT_EXIST)
            return
          }
          // client balance not enogh
          if(clientBalance <= Number(amount)) {
            // the current client balance is not enoghp
            reject(UN_SUFFICENT_FUND)
            return
          }
          // client exist and has suficient balance
          const receiver = await clientsServices.getReceiver({currentClientId: client_id, receiverContact});
          // check if c.client and receiver are same
          if(receiver === SAME_RECEIVER_AND_CURRENT) {
            resolve(SAME_RECEIVER_AND_CURRENT);
            return
          }
          // if receiver dosn't exist
          if(receiver === CLIENT_NOT_EXIST) {
            reject(CLIENT_NOT_EXIST)
            return
          }
          // if no error
          const {_id, socket_id} = receiver as Client
          // complete trans params
          const completeTransferParams = {
            _id: client_id,
            receiverId: _id,
            amount
          } as CompleteTransPrams
          // complete transfer res
          const TransferData = await this.completeTransfer(completeTransferParams);
          // receiver new balance
          const receiverUpdatedBalance = await clientsServices.getClientBalance(_id!);
          // get the sender client
          const {name: sender} = await clientsServices.findClientById(client_id) as Client
          // response data 
          const resData: SubmitTransRes = {
            newTransaction: TransferData[0], 
            newBalance: TransferData[1]
          }
          const io = SocketIoInstance;
          // notify the recever
          const receiverNotification = {
            updatedBalance: receiverUpdatedBalance,
            transAmount: amount,
            sender
          }
          // send the receiver updated balance to the recevier
          io.to(socket_id!).emit("notification", receiverNotification)
          resolve(resData)
        } catch(err) {
          reject(err)
        }
      })
    }
}