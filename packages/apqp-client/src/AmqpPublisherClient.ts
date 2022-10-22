import { Exchange } from '@aa/types/events';

import { AmqpClient } from './AmqpClient';
import { AmqpMetadata, AmqpPublisherClientParams } from './types';

function makeRoutingPrams(exchange: Exchange, queue: string):  [Exchange, string] {
    return [exchange, `${exchange}.${queue}.#`];
}

export class AmqpPublisherClient extends AmqpClient {

    private static instance: AmqpPublisherClient;
    public static getInstance(params: AmqpPublisherClientParams): AmqpPublisherClient {
        if (!this.instance) {
            this.instance = new AmqpPublisherClient(params);
        }

        return this.instance;
    }

    private readonly exchanges: Exchange[];
    private readonly routing: { [key: string]: [Exchange, string] } = {};

    private constructor({ exchanges, routing, ...params }: AmqpPublisherClientParams) {
        super(params);

        this.exchanges = exchanges;

        routing.forEach(([event, exchange, queue]) => {
            this.routing[event] = makeRoutingPrams(exchange, queue);
        });
    }

    public async send<T extends AmqpMetadata>(event: T) {
        const [exchange, routingKey] = this.routing[event.eventName]!;

        try {
            this.channel.publish(
                exchange,
                routingKey,
                this.serializeEvent(event),
                { persistent: true },
            );

            this.logger.info('event has been sent', { routingKey });
        } catch (error) {
            this.logger.error('event sending error', { error, routingKey });
        }
    }

    protected async initOther(): Promise<void> {
        await this.assertExchanges();
    }

    private async assertExchanges(): Promise<void> {
        await Promise.all(this.exchanges.map(it => this.channel.assertExchange(it, 'topic')));
    }

}
