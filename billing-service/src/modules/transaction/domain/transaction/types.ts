import { BaseFindOptions } from '@common/domain/types';

export interface TransactionFindOptions extends BaseFindOptions {
    name?: string;
}

export interface TransactionCreateData {
    id: string;
    link: string;
    name: string;
    authorId: string;
    description?: string;
    rating?: number;
}

export interface TransactionUpdateData {
    link?: string;
    name?: string;
    description?: string;
    rating?: number;
}
