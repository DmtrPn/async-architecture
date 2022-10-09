import { FindCommand } from '@common/infrastructure/FindCommand';
import { TaskModel } from './TaskModel';
import { TaskFindOptions } from '@task/domain/task/types';

export class TaskFindCommand extends FindCommand<TaskModel, TaskFindOptions> {

    constructor(options: TaskFindOptions) {
        super(options, TaskModel);
    }
}
