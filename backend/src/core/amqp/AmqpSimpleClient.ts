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

export class AmqpSimpleClient {

    private logger = LoggerFactory.getLogger();
    private channel!: ChannelWrapper;
    private connectionManager!: IAmqpConnectionManager;
    private isConnectionCancelled  = false;
    private exchange_?: string;
    private config: RabbitMQConfig = Config.getConfig<RabbitMQConfig>(ConfigName.RabbitMQ);
    private onMessageHandler;

    public get exchange(): string {
        return this.exchange_ ?? this.config.exchange;
    }

    public get url() {
        const { protocol, username, password, hostname, vhost } = this.config;
        return `${protocol}://${username}:${password}@${hostname}${vhost}`;
    }

    public async init(exchange?: string): Promise<void> {
        this.exchange_ = exchange;
        this.connect();
        this.initChannel();
    }

    public async consume(queue: string, onMessage: (msg: amqplib.ConsumeMessage) => void) {
        this.onMessageHandler = onMessage;
        try {
            await this.channel.assertQueue(queue, { durable: false });
            // @ts-ignore
            await this.channel.consume(queue, (d) => this.onMessage(d), { noAck: false, prefetch: 1 });
            this.logger.info('econsue', { queue });
        } catch (error) {
            this.logger.error('event sending error', { error, queue });
        }
    }

    public async sendToQueue(queue: string, data: object) {
        try {
            await this.channel.assertQueue(queue, { durable: false });
            // @ts-ignore
            await this.channel.sendToQueue(queue, data, { persistent: true });
            this.logger.info('event has been sent', { queue, data });
        } catch (error) {
            this.logger.error('event sending error', { error, queue, data });
        }
    }

    public async consumeExclusiveExchange(onMessage: (msg: amqplib.ConsumeMessage) => void) {
        this.onMessageHandler = onMessage;
        try {
            await this.channel.assertExchange(this.exchange, 'fanout', { durable: false });
            const q = await this.channel.assertQueue('home', { exclusive: true, autoDelete: true });
            console.log('[*] Waiting for messages in %s. To exit press CTRL+C', q.queue);
            await this.channel.bindQueue('home', this.exchange, '');
            // @ts-ignore
            await this.channel.consume('home', (d) => this.onMessage(d), { noAck: false, prefetch: 1 });
            this.logger.info('econsue', { queue: q.queue });
        } catch (error) {
            this.logger.error('event sending error', { error });
        }
    }

    public async send<T extends AmqpMetadata>(event: T) {
        const { topic = '', data } = event;

        try {
            await this.channel.assertExchange(this.exchange, 'fanout', { durable: false });
            await this.channel.publish(this.exchange, topic, data);

            this.logger.info('event has been sent', { topic });
        } catch (error) {
            this.logger.error('event sending error', { error, topic });
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

    private async onMessage(data: amqplib.ConsumeMessage): Promise<void> {
        const message = JSON.parse(data.content.toString());
        this.logger.info('receiver: got message', { message });
        await this.onMessageHandler(message);
        this.channel.ack(data);
    }

}
