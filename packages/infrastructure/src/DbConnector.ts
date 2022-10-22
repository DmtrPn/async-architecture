import { DataSource, EntityManager, Repository, EntityTarget } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { DbConnectorInitParams } from './types';
import log4js from 'log4js';

export class DbConnector {

    private static instance: DbConnector;

    public static getInstance(): DbConnector {
        if (!this.instance) {
            this.instance = new DbConnector();
        }

        return this.instance;
    }

    private dataSource: DataSource;
    private logger: log4js.Logger;

    public get manager(): EntityManager {
        return this.dataSource.manager;
    }

    public getRepository<Entity>(entity: EntityTarget<Entity>): Repository<Entity> {
        return this.dataSource.getRepository<Entity>(entity);
    }

    public getDataSource(): DataSource {
        if (!this.dataSource.isInitialized) {
            this.logger.info('DB does not initialized');
        }
        return this.dataSource;
    }

    public async initialize({ config, logger }: DbConnectorInitParams): Promise<void> {
        if (!this.dataSource || !this.dataSource.isInitialized) {
            this.logger = this.logger ?? logger;
            this.dataSource = this.dataSource ?? new DataSource(config);
            this.dataSource.namingStrategy = new SnakeNamingStrategy();

            if (!this.dataSource.isInitialized) {
                await this.createConnection()
                    .then((connection) => {
                        if (connection.isInitialized) {
                            this.logger.info(`Connection to the database: ${connection.options.database} is established`);
                        } else {
                            this.logger.error(`Connection to the database: ${connection.options.database} is not established`);
                        }
                        this.dataSource = connection;

                    })
                    .catch(error => this.logger.fatal(error));
            }
        }
    }

    public async closeConnection(): Promise<void> {
        if (this.dataSource && this.dataSource.isInitialized) {
            await this.dataSource.destroy();
        }
    }

    protected async createConnection(): Promise<DataSource> {
        return this.dataSource.initialize();
    }
}