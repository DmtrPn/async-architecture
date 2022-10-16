import { v4 as uuid } from 'uuid';

import { TransactionEvent } from 'aa-types/events';
import { TaskStatus } from 'aa-types/enums';

import { TaskCommand } from './TaskCommand';

interface Params {
    id: number;
}

export class TaskExecuteCommand extends TaskCommand<Params> {

    public async run(): Promise<void> {
        const { id } = this.params;
        const task = await this.crudService.getById(id);
        await this.transactionService.create({
            id: uuid(),
            accountId: task.executorId,
            amount: task.executePrice,
            createdAt: new Date(),
        });

        await this.crudService.update(id, { status: TaskStatus.Executed, executedAt: new Date() });
    }

    protected override async publishEvents(): Promise<void> {
        const { publicId } = await this.crudService.getById(this.params.id);
        this.eventPublisher.send({
            eventName: TransactionEvent.Executed,
            producedAt: new Date(),
            data: { publicId },
        });
    }
}
