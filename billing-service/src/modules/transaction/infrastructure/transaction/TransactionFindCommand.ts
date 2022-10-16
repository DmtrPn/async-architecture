import { FindCommand } from '@common/infrastructure/FindCommand';
import { TransactionModel } from '@transaction/infrastructure/transaction/TransactionModel';
import { TransactionFindOptions } from '@transaction/domain/transaction/types';

export class TransactionFindCommand extends FindCommand<TransactionModel, TransactionFindOptions> {

    constructor(options: TransactionFindOptions) {
        super(options, TransactionModel);
    }
}
