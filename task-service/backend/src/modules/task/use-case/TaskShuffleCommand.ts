import { TaskEvent } from '@aa/types/events';
import { TaskStatus } from '@aa/types/enums';

import { TaskCommand } from './TaskCommand';
import { TaskModel } from '@task/infrastructure/task/TaskModel';

interface Params {
    id: number;
    description?: string;
}

export class TaskShuffleCommand extends TaskCommand<Params> {

    private shuffledTask: { publicId: string, executorId: string }[] = [];

    public async run(): Promise<void> {
        const openTasks = await this.getOpenTasks();
        await Promise.all(openTasks.map(task => this.shuffleTask(task)));
    }

    protected override async publishEvents(): Promise<void> {
        this.shuffledTask.forEach(data => {
            this.eventPublisher.send({
                data,
                eventName: TaskEvent.Assigned,
                producedAt: new Date(),
            });
        });
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

    private async getOpenTasks(): Promise<TaskModel[]> {
        return this.crudService.find({ status: TaskStatus.Open });
    }

    private async shuffleTask(task: TaskModel): Promise<void> {
        const executor = await this.getRandomExecutor();

        if (executor.id !== task.executorId) {
            await this.crudService.update(task.id, { executorId: executor.id });
        }

        this.shuffledTask.push({ publicId: task.publicId, executorId: executor.publicId });
    }

}
