import { Authorized, Query, Resolver } from 'type-graphql';
import { CurrentUser } from '../../model/context';
import { UserInfo } from '../../model/jwt';
import { UserInfoService } from '../userInfoService';

@Resolver(UserInfo)
export class UserInfoServiceImpl implements UserInfoService {
    @Query((_returns) => UserInfo)
    @Authorized()
    user(@CurrentUser() currentUser: UserInfo): Promise<UserInfo> {
        return Promise.resolve(currentUser);
    }
}