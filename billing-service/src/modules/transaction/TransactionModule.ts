import { Module } from '@nestjs/common';
import { TransactionController } from './controllers';

@Module({
    controllers: [TransactionController],
})
export class TransactionModule {}
