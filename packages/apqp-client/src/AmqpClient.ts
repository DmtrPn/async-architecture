import { connect, Connection, ConfirmChannel } from 'amqplib';

import { isDefined } from '@aa/utils';

import { RabbitMQConfig, AmqpClientParams } from './types';

export abstract class AmqpClient {

    protected channel!: ConfirmChannel;
    protected readonly logger;
    private connection!: Connection;
    private isConnectionCancelled  = false;
    private readonly config: RabbitMQConfig;

    constructor({ config, logger }: AmqpClientParams) {
        this.config = config;
        this.logger = logger;
    }

    public get url() {
        const { protocol, username, password, hostname, vhost } = this.config;
        return `${protocol}://${username}:${password}@${hostname}${vhost}`;
    }

    public async init(): Promise<void> {
        await this.connect();
        await this.initChannel();
        await this.initOther();
    }

    public async dispose(): Promise<void> {
        this.isConnectionCancelled = true;

        if (isDefined(this.channel)) {
            await this.channel.close();
        }

        await this.connection.close();
    }

    protected async initOther(): Promise<void> {}

    protected serializeEvent(data: object): Buffer {
        return Buffer.from(JSON.stringify(data));
    }

    protected parseEvent(data: Buffer): object {
        return JSON.parse(data.toString());
    }

    private async connect(): Promise<void> {
        try {
            this.connection = await connect(this.url);
            this.logger.info('rabbitmq connection created');
        } catch (err: unknown) {
            this.logger.error('rabbitmq connection creation failed: ', err);
        }
    }

    private async initChannel(): Promise<void> {
        if (!isDefined(this.channel) && !this.isConnectionCancelled) {
            try {
                this.channel = await this.connection.createConfirmChannel();

                this.channel.on('error', error => {
                    this.logger.error('rabbitmq channel error: ', error);
                });

                this.channel.on('connect', () => {
                    this.logger.info('rabbitmq channel created');
                });
            } catch (err: unknown) {
                this.logger.error('rabbitmq channel creation failed: ', err);
            }
        }
    }

}
