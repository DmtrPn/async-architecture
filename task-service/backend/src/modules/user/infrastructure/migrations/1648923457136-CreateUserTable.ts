import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1648923457136 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query(`
            CREATE TABLE users (
                user_id SERIAL PRIMARY KEY,
                public_id UUID NOT NULL,
                name TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT,
            );
            CREATE INDEX ON users(public_id);
        `);
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query(`
            DROP TABLE users;
        `);
    }

}
