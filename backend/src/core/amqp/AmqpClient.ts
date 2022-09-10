import { IAmqpConnectionManager } from 'amqp-connection-manager/dist/esm/AmqpConnectionManager';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import type * as amqplib from 'amqplib';

import { Config, ConfigName, RabbitMQConfig } from '@core/config';
import { LoggerFactory } from '@components/logging';
import { isDefined } from '@utils/isDefined';

export interface AmqpMetadata {
    eventId: string; // uuid,
    version: string; // 'v1',
    topic: string; //  'encounter-stream.encounter-created',
    eventName: string; // 'encounter-created',
    producer: string; // 'iskra',
    producedAt: Date; // ISO
    queue?: string;
}

export class AmqpClient {

    private logger = LoggerFactory.getLogger();
    private channel!: ChannelWrapper;
    private connectionManager!: IAmqpConnectionManager;
    private isConnectionCancelled  = false;
    private config: RabbitMQConfig = Config.getConfig<RabbitMQConfig>(ConfigName.RabbitMQ);
    private onMessageHandler;

    public get exchange(): string {
        return this.config.exchange;
    }

    public get url() {
        const { protocol, username, password, hostname, vhost } = this.config;
        return `${protocol}://${username}:${password}@${hostname}${vhost}`;
    }

    public async init(): Promise<void> {
        this.connect();
        this.initChannel();
    }

    public async consume(queue: string, onMessage: (msg: amqplib.ConsumeMessage) => void) {
        this.onMessageHandler = onMessage;
        try {
            await this.channel.assertQueue(queue, { durable: false });
            await this.channel.consume(queue, (d) => this.onMessage(d));
            this.logger.info('econsue', { queue });
        } catch (error) {
            this.logger.error('event sending error', { error, queue });
        }
    }

    public async sendToQueue(queue: string, data: object) {
        try {
            await this.channel.assertQueue(queue, { durable: false });
            await this.channel.sendToQueue(queue, data);
            this.logger.info('event has been sent', { queue, data });
        } catch (error) {
            this.logger.error('event sending error', { error, queue, data });
        }
    }

    public async send<T extends AmqpMetadata>(event: T) {
        const { eventId, topic } = event;

        try {
            await this.channel.publish(this.exchange, topic, event);

            this.logger.info('event has been sent', { eventId, topic });
        } catch (error) {
            this.logger.error('event sending error', { error, eventId, topic });
        }
    }

    public async dispose(): Promise<void> {
        this.isConnectionCancelled = true;

        if (isDefined(this.channel)) {
            await this.channel.close();
        }

        await this.connectionManager.close();
    }

    protected connect(): void {
        this.connectionManager = amqp.connect(this.url);

        this.connectionManager.on('connectFailed', cause => {
            this.logger.error('connection to rabbitmq failed: ', cause);
        });

        this.connectionManager.on('connect', () => {
            this.logger.info('rabbitmq connection has been created');

            if (!this.isConnectionCancelled) {
                this.initChannel();
            }
        });
    }

    protected initChannel(): void {
        if (!isDefined(this.channel)) {
            this.channel = this.connectionManager.createChannel({
                confirm: true,
                json: true,
            });

            this.channel.on('error', error => {
                this.logger.error('rabbitmq channel creation was failed: ', error);
            });

            this.channel.on('connect', () => {
                this.logger.info('rabbitmq channel has been created');
            });
        }
    }

    private onMessage(data: amqplib.ConsumeMessage) {
        const message = JSON.parse(data.content.toString());
        this.logger.info('receiver: got message', { message });
        this.onMessageHandler(message);
        this.channel.ack(data);
    }

}
