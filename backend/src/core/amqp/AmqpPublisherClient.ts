import type * as amqplib from 'amqplib';

import { AmqpClient, AmqpMetadata, AmqpClientParams } from './AmqpClient';

interface PublisherParams extends AmqpClientParams {
    type: ExchangeType;
}

type ExchangeType = 'direct' | 'topic' | 'headers' | 'fanout' | 'match';

export class AmqpPublisherClient extends AmqpClient {

    private type: ExchangeType;

    constructor(params: PublisherParams) {
        super(params);

        this.type = params.type;
    }

    public async send<T extends AmqpMetadata>(event: T) {
        const { routingKey = '', data } = event;

        try {
            // @ts-ignore
            await this.channel.publish(this.exchange, routingKey, data, { persistent: true });

            this.logger.info('event has been sent', { routingKey });
        } catch (error) {
            this.logger.error('event sending error', { error, routingKey });
        }
    }

    protected async setupFunction(channel: amqplib.ConfirmChannel): Promise<void> {
        return channel.assertExchange(this.exchange, this.type);

    }
}