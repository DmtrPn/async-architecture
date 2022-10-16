import { TaskStatus } from 'aa-types/enums';
import { BaseFindOptions } from '@common/domain/types';

export interface TaskFindOptions extends BaseFindOptions<number> {
    publicId?: string;
    status?: TaskStatus;
}

export interface TaskCreateData {
    publicId: string;
    authorId: number;
    executorId: number;
    description: string;
}

export interface TaskUpdateData {
    executorId?: number;
    description?: string;
    status?: TaskStatus;
    executedAt?: Date;
}
