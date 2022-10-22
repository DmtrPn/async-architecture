import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import log4js from 'log4js';

export interface DbConnectorInitParams {
    config: DbConfig;
    logger: log4js.Logger;
}

export interface DbConfig extends PostgresConnectionOptions {
    type: 'postgres';
    host: string;
    database: string;
    username: string;
    password: string;
}