import { Inject } from 'typescript-ioc';

import { UseCaseCommand } from '@common/use-cases/UseCaseCommand';
import { IUserCrudService } from '@user/domain/user/IUserCrudService';

export abstract class UserCommand<P extends object> extends UseCaseCommand<P> {
    @Inject protected userCrudService: IUserCrudService;

    protected async getUserIdByPublicId(publicId: string): Promise<number> {
        const { id } = await this.userCrudService.getByPublicId(publicId);

        return id;
    }
}
