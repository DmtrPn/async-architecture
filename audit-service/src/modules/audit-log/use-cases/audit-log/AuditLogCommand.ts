import { Inject } from 'typescript-ioc';

import { UseCaseCommand } from '@common/use-cases/UseCaseCommand';
import { IAuditLogCrudService } from '../../domain/audit-log/IAuditLogCrudService';

export abstract class AuditLogCommand<P extends object> extends UseCaseCommand<P> {
    @Inject protected userCrudService: IAuditLogCrudService;

    protected async getAuditLogIdByPublicId(publicId: string): Promise<number> {
        const { id } = await this.userCrudService.getByPublicId(publicId);

        return id;
    }
}
