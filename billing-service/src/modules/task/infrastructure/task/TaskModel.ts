import { Entity, Column, PrimaryColumn } from 'typeorm';

import { TaskStatus } from '@aa/types/enums';
import { BaseModel } from '@common/infrastructure/BaseModel';

@Entity('task')
export class TaskModel extends BaseModel<TaskModel> {

    @PrimaryColumn({ name: 'task_id' })
    public id: number;

    @Column('uuid')
    public publicId: string;

    @Column()
    public takePrice: number;

    @Column()
    public executePrice: number;

    @Column()
    public authorId: number;

    @Column()
    public executorId: number;

    @Column()
    public status: TaskStatus;

    @Column({ type: 'timestamptz' })
    public executedAt?: Date;

    @Column({ type: 'timestamptz' })
    public createdAt: Date;

}
