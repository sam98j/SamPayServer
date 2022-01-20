import { FilterQuery } from "mongoose";
import { ClientCredentioal } from "../interfaces/auth.service";
import {
  AddNewClientParams,
  AddNewClientRes,
  Client, 
  SingleTransaction, 
  updateClientBalanceParams, 
  UpdateSocketIdRes, 
  UpdateTransHistoryParams
} from "../interfaces/clients.services";
import { ClientFailure } from "../interfaces/enums";
import ClientsModel from '../models/clients'
import moment from "moment";

export default class ClientsService {
  private Model = ClientsModel;
  // find client by credentioal
  findClient = (credentioal: ClientCredentioal): Promise<Client | ClientFailure.CLIENT_NOT_EXIST> => {
    return new Promise(async (resolve, reject) => {
      // return Promise
      try {
        const client = await this.Model.findOne({...credentioal} as FilterQuery<Client>) as Client | null;
        // client dosnot exist
        if(!client) {
          resolve(ClientFailure.CLIENT_NOT_EXIST);
          return
        }
        resolve(client)
      } catch(err) {
        reject(err)
      }
    })
  }
  // get client by his name later on we will use email
  findClientByName = (clientName: string): Promise<Client | ClientFailure.CLIENT_NOT_EXIST> => {
    return new Promise(async (resolve, reject) => {
      // return Promise
      try {
        const client = await this.Model.findOne({name: clientName} as FilterQuery<Client>) as Client | null;
        // client dosnot exist
        if(!client) {
          resolve(ClientFailure.CLIENT_NOT_EXIST);
          return
        }
        resolve(client)
      } catch(err) {
        reject(err)
      }
    })
  }
  // find by id
  findClientById = (_id: string): Promise<Client | ClientFailure.CLIENT_NOT_EXIST> => {
    return new Promise(async (resolve, reject) => {
      try {
        const client = await this.Model.findById(_id) as Client | null;
        // check for null
        if(!client){
          resolve(ClientFailure.CLIENT_NOT_EXIST)
          return
        }
        resolve(client)
      } catch(err) {
        reject(err)
      }
    })
  }
  // get receiver by phone number
  getReceiver = (phone: string): Promise<Client | ClientFailure.CLIENT_NOT_EXIST> => {
    return new Promise(async (resolve, reject) => {
      try {
        const client = await this.Model.findOne({phone}) as Client | null;
        if(!client) {
          resolve(ClientFailure.CLIENT_NOT_EXIST)
          return
        }
        resolve(client)
      } catch(err) {reject(err)}
    })
  }
  // get client current balance
  getClientBalance = (_id: string): Promise<number | ClientFailure.CLIENT_NOT_EXIST> => {
    return new Promise(async(resolve, reject) => {
      try {
        const client = await this.Model.findOne({_id}, {"account.balance": 1}, {}) as Client | null;
        // check for null
        if(!client) {
          resolve(ClientFailure.CLIENT_NOT_EXIST)
          return
        }
        const clientBalance = Number(client.account.balance);
        resolve(clientBalance)
      } catch(err) {reject(err)}
    })
  }
  // update current client balance after transfer done
  updateClientBalance = (data: updateClientBalanceParams): Promise<number> => {
    return new Promise(async(resolve, reject) => {
      const {operation, _id, amount} = data;
      // try to get the old balance of client
      try {
        const oldBalance = await this.getClientBalance(_id)
        if(oldBalance === ClientFailure.CLIENT_NOT_EXIST) {
          reject({err: "client dosn't exist"});
          return
        }
        // new balance of current or receiver client
        const newBalance = operation ? oldBalance + amount : oldBalance - amount;
        // try to update the client balance
        await this.Model.updateOne({_id}, {$set: {"account.balance": newBalance}})
        resolve(newBalance)
      } catch(err){reject("error in updating client balance")}
    })
  }
  // update current client transaction history
  updateTransHis = ({amount, _id, receiverId}: UpdateTransHistoryParams): Promise<SingleTransaction> => {
    return new Promise(async(resolve, reject) => {
      // enums
      const {CLIENT_NOT_EXIST} = ClientFailure;
      // try to get the receiver
      try {
        // get name, avatar from receiver
        const client = await this.findClientById(receiverId)
        // check for client existance
        if(client === CLIENT_NOT_EXIST) {
          reject(CLIENT_NOT_EXIST);
          return
        }
        const {name, avatar} = client;
        // transaction date
        const date = moment().format("YYYY-MMMM-DD, h:mm a")
        // Single Tranasaction
        const Transaction = {
          amount: amount, 
          date, 
          receiver: {name, avatar},
          note: "this is dummy data just for test we can make it dynamic latter"
        } as SingleTransaction;
        // @ts-ignore
        await ClientsModel.updateOne({_id}, {$push: {transactionsHistory: Transaction}})
        // resolve Transaction
        resolve(Transaction)
      } catch(err) {reject("error durring get receiver")}
    })
  }
  // set socket id
  setSocketId = ({_id, socket_id}: {_id: string, socket_id: string}) => {
    return new Promise(async(resolve, reject) => {
      const {CLIENT_NOT_FOUND, SERVER_ERR, SUCCESS} = UpdateSocketIdRes
      try {
        const {modifiedCount} = await this.Model.updateOne({_id}, {$set: {socket_id}})
        if(modifiedCount <= 0) {
          reject(CLIENT_NOT_FOUND)
          return
        }
        resolve(SUCCESS)
      } catch(err) {
        reject(SERVER_ERR)
      }
    })
  }
  // add new client
  addNewClient = ({name, pic = "", email, password}: AddNewClientParams): Promise<AddNewClientRes> => {
    return new Promise(async (resolve, reject) => {
      const {CLIENT_EXIST, CLIENT_ADDED_SUCC} = AddNewClientRes;
      // create new client
      const newClient = {
        name,
        password,
        avatar: pic,
        transactionsHistory: [],
        account: {balance: "0"},
        socket_id: ""
      } as Client
      try {
        const client = await this.findClientByName(name);
        // check if client is exist
        if(client === ClientFailure.CLIENT_NOT_EXIST) {
          await this.Model.insertMany([newClient]);
          resolve(CLIENT_ADDED_SUCC);
          return
        }
        // client exist
        resolve(CLIENT_EXIST)
      } catch(err) {
        reject(err)
      }
    })
  }
  // get Transactions His for client
  getTrxsHis = (clientId: string): Promise<SingleTransaction[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        const {transactionsHistory} = await this.Model.findById(clientId, {transactionsHistory: 1}) as Client
        resolve(transactionsHistory)
      } catch(err) {
        reject(err)
      }
    })
  }
}

