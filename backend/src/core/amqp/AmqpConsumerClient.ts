import type * as amqplib from 'amqplib';
import autobind from 'autobind';

import { AmqpClient, InitData } from './AmqpClient';

interface ConsumerInitData extends InitData {
    type?: string;
    queue?: string;
    exclusive?: boolean;
    onMessage(msg: amqplib.ConsumeMessage): void;
}

export class AmqpPublisherClient extends AmqpClient<ConsumerInitData> {

    private onMessage_: (msg: amqplib.ConsumeMessage) => void;

    protected override initData(data: ConsumerInitData) {
        super.initData(data);
        this.onMessage_ = data.onMessage;
    }

    /* eslint-disable @typescript-eslint/indent */
    protected async setupFunction(
        channel: amqplib.ConfirmChannel,
        data: ConsumerInitData,
    ): Promise<void> {
        return data.exclusive ? this.setupExclusive(channel, data) : this.setupChannel(channel, data);
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
        await channel.bindQueue(queueName, this.exchange, '#');

        await channel.consume(
            queueName,
            (message) => this.onMessage(message),
            { noAck: false },
        );
    }

    private async setupChannel(channel: amqplib.ConfirmChannel, { queue = '' }: ConsumerInitData): Promise<void> {
        await Promise.all([
            channel.assertQueue(queue, { exclusive: true, autoDelete: true }),
            channel.prefetch(1),
            channel.bindQueue(queue, this.exchange, '#'),
            channel.consume(queue, this.onMessage, { noAck: false }),
        ]);

    }
}