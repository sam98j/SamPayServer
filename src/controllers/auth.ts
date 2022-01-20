import { Request, Response } from "express";
import { ClientCredentioal } from "../interfaces/auth.service";
import { AddNewClientRes } from "../interfaces/clients.services";
import { AuthFailure, ClientFailure } from "../interfaces/enums";
import AuthServices from '../services/auth';
const authServices = new AuthServices();

export default class AuthController {
    // login route handler
    loginHandler = async (req: Request, res: Response) => {
        // client credenatioal form req body
        const credenaioals: ClientCredentioal = req.body;
        try {
            const loginRes = await authServices.login(credenaioals);
            // client login failre
            if(loginRes === AuthFailure.LOGIN_FAIL) {
                res.status(400).send({msg: "client dosn't exist"})
                return 
            }
            res.send(loginRes)
        } catch(err) {
            res.status(500).send({msg: "internal server error", err})
        }
    }
    // login with google handler
    loginWithGoogleHandler = async(req: Request, res: Response) => {
        const {googleTokenId} = req.body as {googleTokenId: string};
        try {
            const resData = await authServices.loginWithGoogle(googleTokenId);
            const resStatus = resData === ClientFailure.CLIENT_NOT_EXIST ? 400 : 200
            res.status(resStatus).send(resData)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    // initate client handler
    InitateClientHandler = async (req: Request, res: Response) => {
        // get client id
        const clientId = req.currentClient;
        // send data to client
        authServices.initateClient(clientId!)
        .then(data => {
            res.status(200).send(data)
        }).catch(err => {
            res.status(500).send(err)
        }) 
    }
    // sign up with google
    signUpWithGoogle = async (req: Request, res: Response) => {
        const {googleTokenId} = req.body as {googleTokenId: string};
        try {
            const resData = await authServices.signUpWithGoogle(googleTokenId);
            const resStatus = resData === AddNewClientRes.CLIENT_EXIST ? 400 : 200
            res.status(resStatus).send(resData)
        } catch(err) {
            res.status(500).send(err)
        }
    }
    // signup
    signUpHandler = async (req: Request, res: Response) => {
        const signUpData = req.body as {name: string, password: string}
        try {
            const resData = await authServices.signUp(signUpData);
            const resStatus = resData === AddNewClientRes.CLIENT_EXIST ? 400 : 200
            res.status(resStatus).send(resData)
        } catch(err) {
            res.status(500).send(err)
        }
    }
}