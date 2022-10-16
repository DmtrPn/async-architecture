import { Attributes } from 'aa-types/common';
import { RoleName } from 'aa-types/enums';

import { AuditLogModel } from '../../infrastructure/audit-log/AuditLogModel';

export abstract class IAuditLogCrudService {
    public abstract find(): Promise<AuditLogModel[]>;
    public abstract getById(id: number): Promise<AuditLogModel>;
    public abstract getByPublicId(publicId: string): Promise<AuditLogModel>;
    public abstract create(params: Omit<Attributes<AuditLogModel>, 'id'>): void;
    public abstract update(id: number, params: Partial<Attributes<AuditLogModel>>): void;
    public abstract remove(id: number): void;
    public abstract getRandomAuditLog(role: RoleName): Promise<AuditLogModel>;
}
