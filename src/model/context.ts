import { KeycloakContext } from "keycloak-connect-graphql";
import { createParamDecorator } from "type-graphql";
import { UserInfo } from "./jwt";

export interface Context {
  kauth?: KeycloakContext;
  userInfo?: UserInfo;
}

export function CurrentUser() {
  return createParamDecorator<Context>(({ context }) => context.userInfo);
}

export function CurrentKeycloakAuth() {
  return createParamDecorator<Context>(({ context }) => context.kauth);
}
