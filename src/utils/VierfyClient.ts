import JWT from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export function validateToken(authorization: any): Promise<any> {
  // return new promise
  return new Promise(async(resolve, reject) => {
    // evalute is authorization is true or not
    if(!Boolean(authorization)) {
      reject({err: "your token it's not valid"})
      return
    }
    // type casting the bearer token to string
    const bearerToken = authorization as string;
    // get the token string
    const token = bearerToken.split(" ")[1];
    // verify the token 
    JWT.verify(token, "Token Secret", (err, data) => {
      // if the token is not valid
      if(err) {
        reject({err: "your token it's not valid"})
        return
      }
      resolve(data)
    })
  })
}

export async function validateClientMiddleware(req: Request, res: Response, next: NextFunction){
  try {
    // get id from validated token contains _id and iat
    const {_id} = await validateToken(req.headers.authorization) as {_id: string, iat: number};
    // set currentclient property in req object
    req.currentClient = _id;
    // route request to main endpoint to proccess it
    next()
  } catch(error){
    // bad request and response with error
    res.status(400).send(error)
  }
}