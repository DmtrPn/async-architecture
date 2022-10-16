import { Attributes } from 'aa-types/common';
import { RoleName } from 'aa-types/enums';

import { TransactionManager } from '@common/infrastructure/TransactionManager';
import { IAuditLogCrudService } from '@audit-log/domain/audit-log/IAuditLogCrudService';
import { AuditLogModel } from './AuditLogModel';

export class AuditLogCrudService extends TransactionManager implements IAuditLogCrudService {

    public async getRandomAuditLog(userRole: RoleName): Promise<AuditLogModel> {
        const rows = await this.manager.query(`select * from users where role = ${userRole} offset floor(random() * (select count(*) from users where role = ${userRole}))  limit 1;`);
        return rows.map(({ user_id, public_id, name, role }) => ({ name, role, id: user_id, publicId: public_id }));
    }

    public async find(): Promise<AuditLogModel[]> {
        return this.manager.find<AuditLogModel>(AuditLogModel);
    }

    public async getById(id: number): Promise<AuditLogModel> {
        return this.manager.findOneBy<AuditLogModel>(AuditLogModel, { id });
    }

    public async getByPublicId(publicId: string): Promise<AuditLogModel> {
        return this.manager.findOneBy<AuditLogModel>(AuditLogModel, { publicId });
    }

    public async create(params: Attributes<AuditLogModel>): Promise<void> {
        await this.manager.transaction(entityManager =>
            entityManager
                .createQueryBuilder()
                .insert()
                .into(AuditLogModel)
                .values(params)
                .execute(),
        );
    }

    public async update(id: number, params: Attributes<AuditLogModel>): Promise<void> {
        await this.manager.transaction(entityManager =>
            entityManager
                .createQueryBuilder()
                .update(AuditLogModel)
                .set(params)
                .where({ id })
                .execute(),
        );
    }

    public async remove(id: number): Promise<void> {
        await this.manager.delete(AuditLogModel, { id });
    }

}
