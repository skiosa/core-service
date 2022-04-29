import { Context } from "apollo-server-core";
import express from "express";
import * as jwt from "jsonwebtoken";
import { KeycloakContext } from "keycloak-connect-graphql";
import { AuthChecker, MiddlewareFn } from "type-graphql/dist/interfaces";
import { UserInfo } from "../model/jwt";
import { createUser } from "./userManager";

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
 * @deprecated
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

/**
 * @author LukasLJL, Tim Horlacher
 * @summary authChecker middleware
 * @description checks if a Auth Token is present in the request and adds user to our database if not present
 * @returns {Boolean} - authenticated
 */
export const authChecker: AuthChecker<Context> = ({ context }, roles) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const localContext: any = context;
  const kauth: KeycloakContext = localContext.kauth as KeycloakContext;

  if (kauth.isAuthenticated()) {
    const userInformation = userInfo(kauth) as UserInfo;
    createUser(userInformation);
  }

  if (roles.length === 0) {
    return kauth.isAuthenticated();
  }

  for (const role of roles) {
    if (kauth.hasRole(role)) {
      return true;
    }
  }

  return false;
};

/**
 * @author LukasLJL
 * @summary get the UserInfo from the request
 * @description extracts the jwt from the keycloak context and transforms it to a UserInfo
 * @returns {UserInfo | undefined} - UserInfo
 */
export function userInfo(keyCloakContext: KeycloakContext): UserInfo | undefined {
  if (keyCloakContext.isAuthenticated() && keyCloakContext.accessToken) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tempAccessToken: any = keyCloakContext.accessToken;
    const decoded = jwt.decode(tempAccessToken.token) as jwt.JwtPayload;
    if (decoded) {
      return jwtPayloadContentTransformer(decoded);
    }
    return undefined;
  }
  return undefined;
}

/**
 * @author LukasLJL
 * @summary Middleware to Log all Express Requests
 * @description Middleware to Log all Express Requests
 * @param req express request
 * @param _res express response
 * @param next express next function
 */
export function requestLogger(req: express.Request, _res: express.Response, next: express.NextFunction) {
  console.log(`${new Date().toISOString()} - ${req.method} Request on ${req.url} - ${req.ip} - ${req.headers["user-agent"]}`);
  next();
}

/**
 * @author LukasLJL
 * @summary Middleware to Log all GraphQL Requests
 * @description Middleware to Log all GraphQL Requests
 * @param info graphql request
 * @param next graphql next function
 */
export const logAccess: MiddlewareFn<Context> = ({ info }, next) => {
  console.info(`${new Date().toISOString()} - ${info.parentType.name}.${info.fieldName}`);
  return next();
};
