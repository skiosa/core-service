import express from "express";
import * as jwt from "jsonwebtoken";
import { UserInfo } from "../model/jwt";

/**
 * @author Tim Horlacher
 * @summary Middleware to append decoded UserInfo to request
 * @description Decodes jwt token from request and appends UserInfo to request
 * @param {express.Request} req - Express request object
 * @param {express.Response} _res - Express response object
 * @param {express.NextFunction} next - Express next function
 * @example api.get("/protected", keycloak.protect(), getUserInfo,
  (req: express.Request, res: express.Response) => {
    res.status(200);
    res.json("Hello " + req.UserInfo?.username);
  }
);
 */
export function getUserInfo(req: express.Request, _res: express.Response, next: express.NextFunction) {
  let jwtToken: string = req.headers.authorization as string;
  if (!jwtToken) {
    next();
  } else {
    jwtToken = jwtToken.replace("Bearer ", "");
    const decoded = jwt.decode(jwtToken) as jwt.JwtPayload;
    if (decoded) {
      req.UserInfo = jwtPayloadContentTransformer(decoded);
    }
    next();
  }
}

/**
 * @author Tim Horlacher
 * @summary Converts jwt payload to UserInfo
 * @description Converts jwt payload to UserInfo
 * @param {jwt.JwtPayload} payload - jwt payload
 * @returns {UserInfo} - UserInfo
 */
function jwtPayloadContentTransformer(payload: jwt.JwtPayload): UserInfo {
  return {
    id: payload.sub,
    email: payload.email,
    username: payload.preferred_username,
    firstName: payload.given_name,
    lastName: payload.family_name,
  };
}
