import type * as amqplib from 'amqplib';
import autobind from 'autobind';
import castArray from 'lodash/castArray';

import { AmqpClient, AmqpClientParams } from './AmqpClient';

interface ConsumerInitData {
    exclusive?: boolean;
}
interface ConsumerParams extends AmqpClientParams {
    queue?: string;
    pattern?: string | string[];
    onMessage(msg: amqplib.ConsumeMessage): void;
}

export class AmqpConsumerClient extends AmqpClient<ConsumerInitData> {

    private queue: string;
    private patterns: string[];
    private onMessage_: (msg: amqplib.ConsumeMessage) => void;

    constructor(params: ConsumerParams) {
        super(params);

        this.queue = params.queue ?? '';
        this.onMessage_ = params.onMessage;
        this.patterns = castArray(params.pattern ?? '#');
    }

    /* eslint-disable @typescript-eslint/indent */
    protected async setupFunction(
        channel: amqplib.ConfirmChannel,
        data: ConsumerInitData,
    ): Promise<void> {
        return data.exclusive ? this.setupExclusive(channel, data) : this.setupChannel(channel);
    }

    @autobind
    private async onMessage(data: amqplib.ConsumeMessage): Promise<void> {
        const message = JSON.parse(data.content.toString());
        this.logger.info('receiver: got message', { message });
        await this.onMessage_(message);
        this.channel.ack(data);
    }

    private async setupExclusive(channel: amqplib.ConfirmChannel, _: ConsumerInitData): Promise<void> {
        const qok = await channel.assertQueue('', { exclusive: true, autoDelete: true });
        const queueName = qok.queue;
        await channel.prefetch(1);
        await this.bindQueue(channel, queueName);

        await channel.consume(
            queueName,
            (message) => this.onMessage(message),
            { noAck: false },
        );
    }

    private async setupChannel(channel: amqplib.ConfirmChannel): Promise<void> {
        await Promise.all([
            channel.assertQueue(this.queue, { exclusive: true, autoDelete: true }),
            channel.prefetch(1),
            this.bindQueue(channel, this.queue),
            channel.consume(this.queue, this.onMessage, { noAck: false }),
        ]);
    }

    private async bindQueue(channel: amqplib.ConfirmChannel, queue: string): Promise<void> {
        await Promise.all(this.patterns.map(parrern => channel.bindQueue(queue, this.exchange, parrern)));
    }
}