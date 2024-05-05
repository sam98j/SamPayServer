import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

export const hashPassword = async (password: string) => {
  // generate salt
  const salt = await bcrypt.genSalt(10);
  // generate hashed password
  const hashedPassword = bcrypt.hash(password, salt);
  // return the result
  return hashedPassword;
};
// dehashing the password
export const comparePassword = async (plainPassword: string, hashedPassword: string) => {
  const isValid = await bcrypt.compare(plainPassword, hashedPassword);
  return isValid;
};

// check usr token
export async function validateToken(authorization: any) {
  // evalute is authorization is true or not
  if (!authorization) {
    const error = new Error('Please login to your account first');
    // set error type
    error.name = '400';
    // return error
    throw error;
  }
  // get the token string
  const token = authorization.split(' ')[1];
  // verify the token
  try {
    // verify token
    const data = await JWT.verify(token, process.env.TOKEN_SECRET!);
    // return data
    return data as { _id: string; iat: number };
  } catch (err) {
    const error = new Error('Your token is not valid, please relogin to your account');
    // set error type
    error.name = '400';
    // throw the error
    throw error;
  }
}

// valide client request
export async function validateClientMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    // get id from validated token contains _id and iat
    const { _id } = await validateToken(req.headers.authorization);
    // set currentclient property in req object
    req.currentClient = _id;
    // route request to main endpoint to proccess it
    next();
  } catch (error: any) {
    // bad request and response with error
    res.status(400).send(error?.message);
  }
}
