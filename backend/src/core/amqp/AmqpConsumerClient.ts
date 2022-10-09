import type * as amqplib from 'amqplib';
import autobind from 'autobind';

import { AmqpClient } from './AmqpClient';
import { Exchange } from '@core/amqp/AmqpPublisherClient';

interface ConsumerInitData {
}

export class AmqpConsumerClient extends AmqpClient<ConsumerInitData> {

    private static instance: AmqpConsumerClient;

    public static getInstance(): AmqpConsumerClient {
        if (!this.instance) {
            this.instance = new AmqpConsumerClient();
        }

        return this.instance;
    }

    private readonly onMessage_: (msg: object) => void;

    private readonly routing: [Exchange, string][] = [
        [Exchange.UserStream, `${Exchange.UserStream}.user-created.backend`],
    ];

    private constructor() {
        super();
    }

    protected async initOther(): Promise<void> {
        await Promise.all([
            ...this.routing.map(([exchange, queue]) => this.setupQueue(exchange, queue)),
            this.channel.prefetch(1),
        ]);
    }

    @autobind
    private async onMessage(data: amqplib.ConsumeMessage): Promise<void> {
        const message = this.parseEvent(data.content); // JSON.parse(data.content.toString());
        this.logger.info('receiver: got message', { message });
        await this.onMessage_(message);
        this.channel.ack(data);
    }

    private async setupQueue(exchange: Exchange, queue: string): Promise<void> {
        await Promise.all([
            this.channel.assertQueue(queue),
            this.bindQueue(exchange, queue),
            this.channel.consume(queue, this.onMessage, { noAck: false }),
        ]);
    }

    private async bindQueue(exchange: Exchange, queue: string): Promise<void> {
        await this.channel.bindQueue(queue, exchange, '#');
    }
}