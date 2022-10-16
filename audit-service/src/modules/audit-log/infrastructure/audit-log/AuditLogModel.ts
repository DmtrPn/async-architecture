import { Entity, Column, PrimaryColumn } from 'typeorm';

import { BaseModel } from '@common/infrastructure/BaseModel';
import { RoleName } from '@core/access-control/types';

@Entity('users')
export class AuditLogModel extends BaseModel<AuditLogModel> {

    @PrimaryColumn({ name: 'user_id' })
    public id: number;

    @Column()
    public publicId: string;

    @Column()
    public name: string;

    @Column()
    public role: RoleName;

}
