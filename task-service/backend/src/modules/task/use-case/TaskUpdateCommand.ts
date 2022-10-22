import { TaskEvent } from '@aa/types/events';

import { TaskCommand } from './TaskCommand';

interface Params {
    id: number;
    description?: string;
}

export class TaskUpdateCommand extends TaskCommand<Params> {

    public async run(): Promise<void> {
        const { id, ...params } = this.params;
        await this.crudService.update(id, params);
    }

    protected override async publishEvents(): Promise<void> {
        const { publicId } = await this.crudService.getById(this.params.id);
        this.eventPublisher.send({
            eventName: TaskEvent.Updated,
            producedAt: new Date(),
            data: {
                publicId,
                ...this.params,
            },
        });
    }
}
