import { OAuth2Client, TokenPayload } from "google-auth-library";
import JWT from "jsonwebtoken";
import { ClientCredentioal, LoginSuccess } from '../interfaces/auth.service';
import { AddNewClientParams, AddNewClientRes, Client } from "../interfaces/clients.services";
import { AuthFailure, ClientFailure } from "../interfaces/enums";
import ClientsService from "./clients"

export default class AuthServices {
  private clientsServices = new ClientsService();
  googleOauthClient = new OAuth2Client(process.env.GOOGLE_AUTH_CLIENT_ID!);
  // login service 
  login = (credeantioal: ClientCredentioal): Promise<AuthFailure.LOGIN_FAIL | LoginSuccess> => {
      return new Promise(async(resolve, reject) => {
        // get client from the data base
        try {
          const data = await this.clientsServices.findClient(credeantioal);
          // if client is exist
          if (data === ClientFailure.CLIENT_NOT_EXIST) {
            // send data to the client
            resolve(AuthFailure.LOGIN_FAIL)
            return
          }
          const {_id, account, avatar, transactionsHistory, name} = data;
          // client data that will be send
          const client = { _id, name, account, transactionsHistory, avatar };
          // generate token to the client
          const token: string = JWT.sign({ _id }, "Token Secret");
          // data will send to the client
          const resData = {token, client} as LoginSuccess;
          // send data to the client
          resolve(resData)
        } catch(err) {
          reject(err)
        }
    })
  }
  // Login With Google
  loginWithGoogle = (googleTokenId: string) => {
    return new Promise(async (resolve, reject) => {
      // ticket
      const googleTicket = await this.googleOauthClient.verifyIdToken({
        idToken: googleTokenId,
        audience: process.env.GOOGLE_AUTH_CLIENT_ID!
      })
      // get logged in data
      const {name} = googleTicket.getPayload() as TokenPayload;
      // adding client to database
      try {
        // call add new client function
        const getClientRes = await this.clientsServices.findClientByName(name!);
        // check if client exist
        if(getClientRes === ClientFailure.CLIENT_NOT_EXIST) {
          resolve(ClientFailure.CLIENT_NOT_EXIST);
          return
        }
        // get the data of new client
        const {_id, name: currentUserName, account, transactionsHistory, avatar} = getClientRes
        // client data that will be send
        const client = { _id, name: currentUserName, account, transactionsHistory, avatar };
        // generate token to the client
        const token: string = JWT.sign({ _id }, "Token Secret");
        // data will send to the client
        const resData = {token, client} as LoginSuccess;
        resolve(resData)
      } catch(err) {
        reject(err)
      }
    })
  }
  // initate client service
  initateClient = (_id: string): Promise<Client> => {
      return new Promise(async(resolve, reject) => {
        try {
          // get the client assosated with that id from database
          const client = await this.clientsServices.findClientById(_id);
          if(client === ClientFailure.CLIENT_NOT_EXIST){
            reject({err: "client dosn't exist"})
            return
          }
          resolve(client);
        } catch(err) {
          reject(err)
        }
      })
  }
  // signup with google
  signUpWithGoogle = (googleTokenId: string): Promise<AddNewClientRes.CLIENT_EXIST | LoginSuccess> => {
    return new Promise(async (resolve, reject) => {
      // ticket
      const googleTicket = await this.googleOauthClient.verifyIdToken({
        idToken: googleTokenId,
        audience: process.env.GOOGLE_AUTH_CLIENT_ID!
      })
      // get logged in data
      const {email, name, picture} = googleTicket.getPayload() as TokenPayload;
      // adding client to database
      try {
        const addNewClientParams = {
          email: email!, 
          name: name!, 
          pic: picture!, 
          password: email!
        } as AddNewClientParams
        // call add new client function
        const addNewClientRes = await this.clientsServices.addNewClient(addNewClientParams);
        // check if client exist
        if(addNewClientRes === AddNewClientRes.CLIENT_EXIST) {
          resolve(AddNewClientRes.CLIENT_EXIST);
          return
        }
        // get the data of new client
        const {_id, name: currentUserName, account, transactionsHistory, avatar} = await this.clientsServices.findClient({name: name!, password: email!}) as Client
        // client data that will be send
        const client = { _id, name: currentUserName, account, transactionsHistory, avatar };
        // generate token to the client
        const token: string = JWT.sign({ _id }, "Token Secret");
        // data will send to the client
        const resData = {token, client} as LoginSuccess;
        resolve(resData)
      } catch(err) {
        reject(err)
      }
    })
  }
  // signUp
  signUp = ({name, password}: {name: string, password: string}): Promise<LoginSuccess | AddNewClientRes.CLIENT_EXIST> => {
    return new Promise(async (resolve, reject) => {
      try {
        // call add new client service
        const addClientRes = await this.clientsServices.addNewClient({name, password, email: ""});
        // check for add client res
        if(addClientRes === AddNewClientRes.CLIENT_EXIST) {
          resolve(AddNewClientRes.CLIENT_EXIST);
          return
        }
        // get the data of new client
        const {_id, name: currentUserName, account, transactionsHistory, avatar} = await this.clientsServices.findClient({name, password}) as Client
        // client data that will be send
        const client = { _id, name: currentUserName, account, transactionsHistory, avatar };
        // generate token to the client
        const token: string = JWT.sign({ _id }, "Token Secret");
        // data will send to the client
        const resData = {token, client} as LoginSuccess;
        resolve(resData)
      } catch(err) {
        reject(err)
      }
    })
  }
}