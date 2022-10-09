import { UserEventName } from 'aa-types/events';

import { RoleName } from '@core/access-control/types';

import { UserCommand } from './UserCommand';

interface Params {
    id: number;
    name?: string;
    email?: string;
    role?: RoleName;
}

export class CreateUserCommand extends UserCommand<Params> {

    public async execute(): Promise<void> {
        const { id, ...params } = this.params;
        await this.userCrudService.update(id, params);
        await this.publishUpdateEvent();
    }

    private async publishUpdateEvent(): Promise<void> {
        const { publicId } = await this.userCrudService.getById(this.params.id);
        this.eventPublisher.send({
            eventName: UserEventName.UserUpdated,
            producedAt: new Date(),
            data: {
                publicId,
                ...this.params,
            },
        });
    }
}
