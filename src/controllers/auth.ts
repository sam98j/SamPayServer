import { Request, Response } from 'express';
import { ClientCredentioal, UserRegestrationData } from '../interfaces/auth.service';
import { AddNewClientRes } from '../interfaces/clients.services';
import { AuthFailure, ClientFailure } from '../interfaces/enums';
import AuthServices from '../services/auth';
import { MailDataRequired } from '@sendgrid/mail';
import { sendMail } from '../services/mail';
const authServices = new AuthServices();

export default class AuthController {
  // login route handler
  loginHandler = async (req: Request, res: Response) => {
    try {
      // client credenatioal form req body
      const credenaioals = req.body as ClientCredentioal;
      const loginRes = await authServices.login(credenaioals);
      // check if client dosenot exist
      if (loginRes === AuthFailure.LOGIN_FAIL) {
        res.status(400).send({ msg: 'Client Dosnot Exist' });
        return;
      }
      // check if client password is incorrect
      if (loginRes === AuthFailure.PASSWORD_NOT_CORRECT) {
        res.status(400).send({ msg: 'Password is inCorrect' });
        return;
      }
      // client exist and password is correct
      res.send(loginRes);
    } catch (err) {
      res.status(500).send({ msg: 'internal server error', err });
    }
  };
  // login with google handler
  loginWithGoogleHandler = async (req: Request, res: Response) => {
    const { googleTokenId } = req.body as { googleTokenId: string };
    try {
      const resData = await authServices.loginWithGoogle(googleTokenId);
      const resStatus = resData === ClientFailure.CLIENT_NOT_EXIST ? 400 : 200;
      res.status(resStatus).send(resData);
    } catch (err) {
      res.status(500).send(err);
    }
  };
  // initate client handler
  InitateClientHandler = async (req: Request, res: Response) => {
    // get client id
    const clientId = req.currentClient;
    // send data to client
    authServices
      .initateClient(clientId!)
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  };
  // sign up with google
  signUpWithGoogle = async (req: Request, res: Response) => {
    const { googleTokenId } = req.body as { googleTokenId: string };
    try {
      const resData = await authServices.signUpWithGoogle(googleTokenId);
      const resStatus = resData === AddNewClientRes.CLIENT_EXIST ? 400 : 200;
      res.status(resStatus).send(resData);
    } catch (err) {
      res.status(500).send(err);
    }
  };
  // signup
  signUpHandler = async (req: Request, res: Response) => {
    // request body or request data
    const signUpData = req.body as UserRegestrationData;
    try {
      // call the SignUp authService and pass reqData to it, and receive the response
      const resData = await authServices.signUp(signUpData);
      // determine the res statusCode depend on SignUp ouput
      const resStatus = resData === AddNewClientRes.CLIENT_EXIST ? 400 : 200;
      res.status(resStatus).send(resData);
    } catch (err) {
      res.status(500).send(err);
    }
  };
  // mail Handler
  sendMailHandler = async (req: Request, res: Response) => {
    const { receiver } = req.body as { receiver: string };
    const mailData = {
      to: receiver,
      from: 'hosam98j@hotmail.com',
      subject: 'test subject',
      text: 'test text',
    } as MailDataRequired;
    try {
      const response = await sendMail(mailData);
      res.send(response);
    } catch (error) {
      res.status(500).send(error);
    }
  };
}
