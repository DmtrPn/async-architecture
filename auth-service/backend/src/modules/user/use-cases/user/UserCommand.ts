import { Inject } from 'typescript-ioc';

import { UseCaseCommand } from '@common/use-cases/UseCaseCommand';
import { IUserCrudService } from '@user/domain/user/IUserCrudService';
import { AmqpPublisherClient } from '@core/amqp/AmqpPublisherClient';

export abstract class UserCommand<P extends object> extends UseCaseCommand<P> {

    @Inject protected userCrudService: IUserCrudService;
    protected eventPublisher = AmqpPublisherClient.getInstance();

}
