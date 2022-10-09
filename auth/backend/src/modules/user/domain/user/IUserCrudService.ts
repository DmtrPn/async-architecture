import { Attributes, Optional } from 'aa-types/common';

import { UserModel } from '@user/infrastructure/user/UserModel';

export abstract class IUserCrudService {
    public abstract find(): Promise<UserModel[]>;
    public abstract getById(id: number): Promise<UserModel>;
    public abstract getByPublicId(publicId: string): Promise<UserModel>;
    public abstract getByEmail(email: string): Promise<Optional<UserModel>>;
    public abstract create(params: Omit<Attributes<UserModel>, 'id'>): void;
    public abstract update(id: number, params: Partial<Attributes<UserModel>>): void;
    public abstract remove(id: number): void;

}
