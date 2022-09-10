import type * as amqplib from 'amqplib';

import { AmqpClient, AmqpMetadata, InitData } from './AmqpClient';

interface PublisherInitData extends InitData {
    type?: string;
}

export class AmqpPublisherClient extends AmqpClient<PublisherInitData> {

    public async send<T extends AmqpMetadata>(event: T) {
        const { topic = '', data } = event;

        try {
            // @ts-ignore
            await this.channel.publish(this.exchange, topic, data, { persistent: true });

            this.logger.info('event has been sent', { topic });
        } catch (error) {
            this.logger.error('event sending error', { error, topic });
        }
    }

    protected async setupFunction(channel: amqplib.ConfirmChannel, { type = 'fanout' }: PublisherInitData): Promise<void> {
        return channel.assertExchange(this.exchange, type);

    }
}