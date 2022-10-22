import { TaskEvent, TransactionEvent } from '@aa/types/events';
import { EventSchemaRegistry } from '@aa/event-schema-registry';

import { TaskCommand } from './TaskCommand';

interface Params {
    publicId: string;
    authorId: number;
    description: string;
}

export class TaskCreateCommand extends TaskCommand<Params> {

    public async run(): Promise<void> {
        // Создание таска (с ценой взятия и результата)
        // Взятие денег с исполнителя
    }

    protected override async publishEvents(): Promise<void> {
        const task = await this.crudService.getByPublicId(this.params.publicId);
        const event = {
            eventName: TaskEvent.Created,
            producedAt: new Date(),
            data: task,
        };

        if (EventSchemaRegistry.isValid(event)) {
            this.eventPublisher.send({
                eventName: TransactionEvent.Executed,
                producedAt: new Date(),
                data: task,
            });
        }
    }
}
