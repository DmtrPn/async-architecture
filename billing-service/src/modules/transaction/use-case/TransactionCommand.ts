import { Inject } from 'typescript-ioc';

import { UseCaseCommand } from '@common/use-cases/UseCaseCommand';
import { ITransactionCrudService } from '@transaction/domain/transaction/ITransactionCrudService';

export abstract class TransactionCommand<Params extends object> extends UseCaseCommand<Params> {

    @Inject protected crudService: ITransactionCrudService;

}
