import { UserModel } from '@user/infrastructure/user/UserModel';

export abstract class IJWTTokenService {
    public abstract create(userId: number): Promise<string>;
    public abstract decode(token: string, secret: string): Promise<UserModel>;
}
