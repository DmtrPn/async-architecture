import { Class, Attributes } from 'aa-types/common';
import { TaskStatus } from 'aa-types/enums';

import { ITaskCrudService } from '@task/domain/task/ITaskCrudService';
import { TaskCreateData, TaskFindOptions, TaskUpdateData } from '@task/domain/task/types';

import { TaskModel } from './TaskModel';
import { TaskFindCommand } from './TaskFindCommand';
import { IdentityCrudService } from '@common/infrastructure/IdentityCrudService';
import { FindCommand } from '@common/infrastructure/FindCommand';

export class TaskCrudService
    extends IdentityCrudService<TaskModel, TaskCreateData, TaskUpdateData, TaskFindOptions>
    implements ITaskCrudService {

    protected modelClass = TaskModel;
    protected findCommand: Class<FindCommand<TaskModel, TaskFindOptions>, any> = TaskFindCommand;

    public async getByPublicId(publicId: string): Promise<TaskModel> {
        return this.manager.findOneBy(TaskModel, { publicId });
    }

    protected enrichCreationParams(params: TaskCreateData): TaskModel {
        return new TaskModel({ ...params, status: TaskStatus.Open, createdAt: new Date() } as Attributes<TaskModel>);
    }

}
