export interface ClientAccount {
    balance: string;
}
      
export interface Client {
  _id?: string; // id of client
  name: string; // name of client
  password?: string; // password of client
  account: ClientAccount; // client account object
  transactionsHistory: []; // history of transactions
  avatar: string; // client image
  phone?: any,
  socket_id?: string
}
// single transaction is history
export interface SingleTransaction {
  receiver: {name: String, avatar: string}; // how receive the amount 
  amount: number; // amount of transfer
  date: string; // date of transaction 
  note: string
}
// update client balance paramters
export interface updateClientBalanceParams {
  amount: number, 
  _id: string, 
  operation: boolean
}
// socket 
export enum UpdateSocketIdRes {
  SERVER_ERR = "SERVER_ERR",
  CLIENT_NOT_FOUND = "CLIENT_NOT_FOUND",
  SUCCESS = "SUCCESS"
}
// update client transaction history
export interface UpdateTransHistoryParams {
  _id: string, 
  receiverId: string,
  amount: number
}
// addnew Client function params
export interface AddNewClientParams {
  pic?: string, 
  name: string, 
  email: string, 
  password: string
}
// AddNewClient retured values
export enum AddNewClientRes {
  CLIENT_EXIST = "CLIENT_EXIST",
  CLIENT_ADDED_SUCC = "CLIENT_ADDED_SUCC"
}