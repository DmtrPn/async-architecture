import { UserEvent } from 'aa-types/events';

import { AmqpMetadata } from '@core/amqp/AmqpClient';
import { UserUpdateCommand, UserCreateCommand } from '@user/use-cases/user';
import { UseCaseCommand } from '@common/use-cases/UseCaseCommand';

export class UserEventListener {
    public static async onMessage({ eventName, data }: AmqpMetadata): Promise<void> {
        let command: UseCaseCommand<any>;

        switch (eventName) {
            case UserEvent.Created:
                command = new UserCreateCommand(data);
                break;
            case UserEvent.Updated:
                command = new UserUpdateCommand(data);
                break;
        }

        if (!!command) {
            await command.execute();
        }
    }
}