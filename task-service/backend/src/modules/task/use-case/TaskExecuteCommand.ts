import { TaskEvent } from 'aa-types/events';
import { TaskStatus } from 'aa-types/enums';

import { TaskCommand } from './TaskCommand';

interface Params {
    id: number;
}

export class TaskExecuteCommand extends TaskCommand<Params> {

    public async run(): Promise<void> {
        const { id } = this.params;
        await this.crudService.update(id, { status: TaskStatus.Executed, executedAt: new Date() });
    }

    protected override async publishEvents(): Promise<void> {
        const { publicId } = await this.crudService.getById(this.params.id);
        this.eventPublisher.send({
            eventName: TaskEvent.Executed,
            producedAt: new Date(),
            data: { publicId },
        });
    }
}
