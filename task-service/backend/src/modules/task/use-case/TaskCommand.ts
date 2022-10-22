import { Inject } from 'typescript-ioc';

import { RoleName } from '@aa/types/enums';

import { UseCaseCommand } from '@common/use-cases/UseCaseCommand';
import { ITaskCrudService } from '@task/domain/task/ITaskCrudService';
import { IUserCrudService } from '@user//domain/user/IUserCrudService';
import { AmqpPublisherClient } from '@core/amqp/AmqpPublisherClient';
import { UserModel } from '@user/infrastructure/user/UserModel';

export abstract class TaskCommand<Params extends object> extends UseCaseCommand<Params> {

    @Inject protected crudService: ITaskCrudService;
    @Inject protected userCrudService: IUserCrudService;
    protected eventPublisher = AmqpPublisherClient.getInstance();

    public async execute(): Promise<void> {
        await this.run();
        await this.publishEvents();
    }

    protected abstract run(): Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected async publishEvents(): Promise<void> {}

    protected async getRandomExecutor(): Promise<UserModel> {
        return this.userCrudService.getRandomUser(RoleName.User);
    }

}
