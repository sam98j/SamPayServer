import express, { Request, Response } from "express";
const Router = express.Router();
import AuthController from "../controllers/auth";
import { validateClientMiddleware } from "../utils/VierfyClient";
const AuthHandlers = new AuthController();
// handle login route
Router.post("/login", AuthHandlers.loginHandler);
// login in with google
Router.post("/login_with_google", AuthHandlers.loginWithGoogleHandler)
// google auth
Router.post("/signup_with_google", AuthHandlers.signUpWithGoogle)
// signUp user
Router.post("/signup", AuthHandlers.signUpHandler)
// route to check if user is already login
Router.get("/initate_client",validateClientMiddleware , AuthHandlers.InitateClientHandler);
// route to send mail
Router.post("/sendmail", AuthHandlers.sendMailHandler);
// export Router as default
export default Router;
