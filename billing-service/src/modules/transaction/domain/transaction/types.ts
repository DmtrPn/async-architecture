import { BaseFindOptions } from '@common/domain/types';

export interface TransactionFindOptions extends BaseFindOptions {
    name?: string;
}

export interface TransactionCreateData {
    id: string;
    accountId: number;
    amount: number;
    createdAt: Date;
}

export interface TransactionUpdateData {
    link?: string;
    name?: string;
    description?: string;
    rating?: number;
}
