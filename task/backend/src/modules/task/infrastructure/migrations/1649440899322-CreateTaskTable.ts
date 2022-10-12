import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTaskTable1649440899322 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query(`
            CREATE TABLE task (
                task_id SERIAL PRIMARY KEY,
                public_id UUID NOT NULL,
                description TEXT NOT NULL,
                author_id UUID NOT NULL REFERENCES users(user_id),
                executor_id UUID NOT NULL REFERENCES users(user_id),
                status TEXT NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
                executed_at TIMESTAMPTZ
            );
            CREATE INDEX ON task(public_id);
        `);
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query(`
            DROP TABLE task;
        `);
    }

}
