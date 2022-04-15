import { UserInfo } from '../model/jwt';

export interface UserInfoService {
    user(currentUser: UserInfo): Promise<UserInfo>;
}

