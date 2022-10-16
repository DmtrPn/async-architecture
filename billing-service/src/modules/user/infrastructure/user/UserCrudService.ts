import { Attributes } from 'aa-types/common';
import { RoleName } from 'aa-types/enums';

import { TransactionManager } from '@common/infrastructure/TransactionManager';
import { IUserCrudService } from '@user/domain/user/IUserCrudService';
import { UserModel } from './UserModel';

export class UserCrudService extends TransactionManager implements IUserCrudService {

    public async getRandomUser(userRole: RoleName): Promise<UserModel> {
        const rows = await this.manager.query(`select * from users where role = ${userRole} offset floor(random() * (select count(*) from users where role = ${userRole}))  limit 1;`);
        return rows.map(({ user_id, public_id, name, role }) => ({ name, role, id: user_id, publicId: public_id }));
    }

    public async find(): Promise<UserModel[]> {
        return this.manager.find<UserModel>(UserModel);
    }

    public async getById(id: number): Promise<UserModel> {
        return this.manager.findOneBy<UserModel>(UserModel, { id });
    }

    public async getByPublicId(publicId: string): Promise<UserModel> {
        return this.manager.findOneBy<UserModel>(UserModel, { publicId });
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
