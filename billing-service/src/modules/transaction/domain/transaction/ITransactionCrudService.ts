import { TransactionManager } from '@common/infrastructure/TransactionManager';
import { TransactionModel } from '@transaction/infrastructure/transaction/TransactionModel';
import { TransactionFindOptions, TransactionUpdateData, TransactionCreateData } from '@transaction/domain/transaction/types';

export abstract class ITransactionCrudService extends TransactionManager {
    public abstract find(options: TransactionFindOptions): Promise<TransactionModel[]>;
    public abstract getById(id: string): Promise<TransactionModel>;
    public abstract create(params: TransactionCreateData): void;
    public abstract update(id: string, params: TransactionUpdateData): void;
    public abstract remove(id: string): void;
}
