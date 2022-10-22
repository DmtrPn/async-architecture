import { TaskEvent } from '@aa/types/events';

import { TaskCommand } from './TaskCommand';

interface Params {
    publicId: string;
    authorId: number;
    description: string;
}

export class TaskCreateCommand extends TaskCommand<Params> {

    public async run(): Promise<void> {
        const { id: executorId } = await this.getRandomExecutor();
        await this.crudService.create({ executorId, ...this.params });
    }

    protected override async publishEvents(): Promise<void> {
        const task = await this.crudService.getByPublicId(this.params.publicId);
        this.eventPublisher.send({
            eventName: TaskEvent.Created,
            producedAt: new Date(),
            data: task,
        });
    }
}
