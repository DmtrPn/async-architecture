import { Class } from 'project-types/common';

import { ITransactionCrudService } from '@catalog/domain/movie/ITransactionCrudService';
import { TransactionCreateData, TransactionFindOptions, TransactionUpdateData } from '@catalog/domain/movie/types';

import { TransactionModel } from './TransactionModel';
import { TransactionFindCommand } from './TransactionFindCommand';
import { IdentityCrudService } from '@common/infrastructure/IdentityCrudService';
import { FindCommand } from '@common/infrastructure/FindCommand';
import { TransactionStatus } from '@components/common/enums';

export class TransactionsCrudService
    extends IdentityCrudService<TransactionModel, TransactionCreateData, TransactionUpdateData, TransactionFindOptions>
    implements ITransactionCrudService {

    protected modelClass = TransactionModel;
    protected findCommand: Class<FindCommand<TransactionModel, TransactionFindOptions>, any> = TransactionFindCommand;

    protected enrichCreationParams(params: TransactionCreateData): TransactionModel {
        return new TransactionModel({ ...params, status: TransactionStatus.New });
    }

}
