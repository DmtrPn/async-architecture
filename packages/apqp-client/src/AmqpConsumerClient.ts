import type * as amqplib from 'amqplib';
import autobind from 'autobind';

import { Exchange } from '@aa/types/events';

import { AmqpClient } from './AmqpClient';

import { AmqpConsumerClientParams } from './types';

export class AmqpConsumerClient extends AmqpClient {

    private static instance: AmqpConsumerClient;

    public static getInstance(params: AmqpConsumerClientParams): AmqpConsumerClient {
        if (!this.instance) {
            this.instance = new AmqpConsumerClient(params);
        }

        return this.instance;
    }

    private readonly onMessage_: (msg: object) => void;
    private readonly routing: [Exchange, string][];

    private constructor({ onMessage, routing, ...params }: AmqpConsumerClientParams) {
        super(params);

        this.onMessage_ = onMessage;
        this.routing = routing;
    }

    protected async initOther(): Promise<void> {
        await Promise.all([
            ...this.routing.map(([exchange, queue]) => this.setupQueue(exchange, queue)),
            this.channel.prefetch(1),
        ]);
    }

    @autobind
    private async onMessage(data: amqplib.ConsumeMessage): Promise<void> {
        const message = this.parseEvent(data.content);
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
        await this.channel.bindQueue(queue, exchange as unknown as string, '#');
    }
}