import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/esm/AmqpConnectionManager';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import type * as amqplib from 'amqplib';

import { Config, ConfigName, RabbitMQConfig } from '@core/config';
import { LoggerFactory } from '@components/logging';
import { isDefined } from '@utils/isDefined';

export interface AmqpMetadata {
    eventId?: string; // uuid,
    version?: string; // 'v1',
    topic?: string; //  'encounter-stream.encounter-created',
    eventName?: string; // 'encounter-created',
    producer?: string; // 'iskra',
    producedAt?: Date; // ISO
    queue?: string;
    data: object;
}

export interface InitData {
    exchange?: string;
}

export abstract class AmqpClient<D extends InitData = {}> {

    protected channel!: ChannelWrapper;
    protected logger = LoggerFactory.getLogger();
    private connectionManager!: IAmqpConnectionManager;
    private isConnectionCancelled  = false;
    private exchange_?: string;
    private config: RabbitMQConfig = Config.getConfig<RabbitMQConfig>(ConfigName.RabbitMQ);

    public get exchange(): string {
        return this.exchange_ ?? this.config.exchange;
    }

    public get url() {
        const { protocol, username, password, hostname, vhost } = this.config;
        return `${protocol}://${username}:${password}@${hostname}${vhost}`;
    }

    public async init(data: D = {} as D): Promise<void> {
        this.initData(data);
        this.connect(data);
        this.initChannel(data);
    }

    public async dispose(): Promise<void> {
        this.isConnectionCancelled = true;

        if (isDefined(this.channel)) {
            await this.channel.close();
        }

        await this.connectionManager.close();
    }

    protected abstract setupFunction(channel: amqplib.ConfirmChannel, data: D): void;

    protected initData(data: D): void {
        this.exchange_ = data.exchange;
    }

    private connect(data: D): void {
        this.connectionManager = amqp.connect(this.url);

        this.connectionManager.on('connectFailed', cause => {
            this.logger.error('connection to rabbitmq failed: ', cause);
        });

        this.connectionManager.on('connect', () => {
            this.logger.info('rabbitmq connection has been created');

            if (!this.isConnectionCancelled) {
                this.initChannel(data);
            }
        });
    }

    private initChannel(data: D): void {
        if (!isDefined(this.channel)) {
            this.channel = this.connectionManager.createChannel({
                json: true,
                setup: channel => this.setupFunction(channel, data),
            });

            this.channel.on('error', error => {
                this.logger.error('rabbitmq channel creation was failed: ', error);
            });

            this.channel.on('connect', () => {
                this.logger.info('rabbitmq channel has been created');
            });
        }
    }

}
