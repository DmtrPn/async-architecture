import { UserEvent } from 'aa-types/events';

import { UserStatus } from '@common/enums';
import { RoleName } from '@core/access-control/types';

import { UserCommand } from './UserCommand';

interface Params {
    publicId: string;
    name: string;
    email: string;
    status: UserStatus;
    password: string;
    role: RoleName;
}

export class CreateUserCommand extends UserCommand<Params> {

    public async execute(): Promise<void> {
        await this.userCrudService.create(this.params);
        await this.publishCreateEvent();
    }

    private async publishCreateEvent(): Promise<void> {
        const user = await this.userCrudService.getByPublicId(this.params.publicId);
        this.eventPublisher.send({
            eventName: UserEvent.Created,
            producedAt: new Date(),
            data: user,
        });
    }
}
