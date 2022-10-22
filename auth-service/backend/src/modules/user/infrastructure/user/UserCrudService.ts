import { TransactionManager } from '@common/infrastructure/TransactionManager';
import { Attributes, Optional } from '@aa/types/common';

import { UserModel } from './UserModel';
import { IUserCrudService } from '@user/domain/user/IUserCrudService';

export class UserCrudService extends TransactionManager implements IUserCrudService {

    public async find(): Promise<UserModel[]> {
        return this.manager.find<UserModel>(UserModel);
    }

    public async getById(id: number): Promise<UserModel> {
        return this.manager.findOneBy<UserModel>(UserModel, { id });
    }

    public async getByPublicId(publicId: string): Promise<UserModel> {
        return this.manager.findOneBy<UserModel>(UserModel, { publicId });
    }

    public async getByEmail(email: string): Promise<Optional<UserModel>> {
        return this.manager.getRepository(UserModel).findOne({
            where: { email },
            select: ['id',  'publicId', 'name', 'email', 'status', 'password', 'role'],
        });
    }

    public async create(params: Attributes<UserModel>): Promise<void> {
        await this.manager.transaction(entityManager =>
            entityManager
                .createQueryBuilder()
                .insert()
                .into(UserModel)
                .values(params)
                .execute(),
        );
    }

    public async update(id: number, params: Attributes<UserModel>): Promise<void> {
        await this.manager.transaction(entityManager =>
            entityManager
                .createQueryBuilder()
                .update(UserModel)
                .set(params)
                .where({ id })
                .execute(),
        );
    }

    public async remove(id: number): Promise<void> {
        await this.manager.delete(UserModel, { id });
    }

}
