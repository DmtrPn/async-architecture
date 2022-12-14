import { Entity, Column, PrimaryColumn } from 'typeorm';

import { BaseModel } from '@common/infrastructure/BaseModel';

@Entity('transaction')
export class TransactionModel extends BaseModel<TransactionModel> {

    @PrimaryColumn({ name: 'transaction_id' })
    public id: string;

    @Column()
    public accountId: number;

    @Column({ type: 'int' })
    public amount: number;

    @Column()
    public createdAt: Date;

}
