import type * as amqplib from 'amqplib';
import autobind from 'autobind';

import { Exchange } from '@aa/types/events';

import { UserEventListener } from '@user/application/event-listener/UserEventListener';
import { AmqpClient } from './AmqpClient';

interface ConsumerInitData {
}

function makeRoutingPrams(exchange: Exchange, queue: string):  [Exchange, string] {
    return [exchange, `${exchange}.${queue}.task`];
}

export class AmqpConsumerClient extends AmqpClient<ConsumerInitData> {

    private static instance: AmqpConsumerClient;

    public static getInstance(): AmqpConsumerClient {
        if (!this.instance) {
            this.instance = new AmqpConsumerClient();
        }

        return this.instance;
    }

    private readonly onMessage_ = UserEventListener.onMessage;

    private readonly routing: [Exchange, string][] = [
        makeRoutingPrams(Exchange.UserStream, 'user-created'),
        makeRoutingPrams(Exchange.UserStream, 'user-updated'),
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