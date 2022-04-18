import { UserInfo } from '../model/jwt';

export interface UserInfoService {
    /**
    * @author LukasLJL
    * @summary Get User Information
    * @description Get User information from Keycloak if user is logged in
    * @param {UserInfo} currentUser - ParameterDecorator for GraphQL
    * @returns {UserInfo} User Information
    */
    user(currentUser: UserInfo): Promise<UserInfo>;
}

