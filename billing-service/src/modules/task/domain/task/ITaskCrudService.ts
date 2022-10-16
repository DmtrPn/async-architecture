import { TransactionManager } from '@common/infrastructure/TransactionManager';

import { TaskModel } from '@task/infrastructure/task/TaskModel';
import { TaskCreateData, TaskFindOptions, TaskUpdateData } from '@task/domain/task/types';

export abstract class ITaskCrudService extends TransactionManager {
    public abstract create(params: TaskCreateData): void;
    public abstract update(id: number, params: TaskUpdateData): void;
    public abstract find(options: TaskFindOptions): Promise<TaskModel[]>;
    public abstract getById(id: number): Promise<TaskModel>;
    public abstract getByPublicId(publicId: string): Promise<TaskModel>;
}
