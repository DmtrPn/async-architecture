import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuditLogTable1648923457136 implements MigrationInterface {

    public async up(queryRunner: QueryRunner) {
        await queryRunner.query(`
            CREATE TABLE audit_log (
                event_id UUID NOT NULL,
                event_version TEXT,
                event_name TEXT NOT NULL,
                created_at TIMESTAMPTZ NOT NULL,
                data JSONB
            );
            CREATE INDEX ON audit_log(event_id);
        `);
    }

    public async down(queryRunner: QueryRunner) {
        await queryRunner.query(`
            DROP TABLE audit_log;
        `);
    }

}
