import { Inject } from 'typescript-ioc';

import { IJWTTokenService } from '@user/domain/auth/IJWTTokenService';
import { IUserCrudService } from '@user/domain/user/IUserCrudService';

import { Config, ConfigName, JWTConfig } from '@core/config';
import { sign, verify } from 'jsonwebtoken';
import { UserModel } from '@user/infrastructure/user/UserModel';

export class JWTTokenService implements IJWTTokenService {

    @Inject protected userCrudService: IUserCrudService;
    private secret: string = Config.getConfig<JWTConfig>(ConfigName.JWT).secret;

    public async create(email: string): Promise<string> {
        const user = await this.userCrudService.getByEmail(email);

        return sign(user, this.secret);
    }

    public async decode(token: string, secret: string): Promise<UserModel> {
        return verify(token, secret) as UserModel;
    }

}