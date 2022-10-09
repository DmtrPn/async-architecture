import { AmqpClient, AmqpMetadata } from './AmqpClient';

export const enum Exchange {
}

export const enum EventName {
}

export class AmqpPublisherClient extends AmqpClient {

    private static instance: AmqpPublisherClient;
    public static getInstance(): AmqpPublisherClient {
        if (!this.instance) {
            this.instance = new AmqpPublisherClient();
        }

        return this.instance;
    }

    private exchanges: Exchange[] = [];
    private routing: { [key: string]: [Exchange, string] } = {
    };

    private constructor() {
        super();
    }

    public async send<T extends AmqpMetadata>(event: T) {
        const [exchange, routingKey] = this.routing[event.eventName]!;

        try {
            this.channel.publish(exchange, routingKey, this.serializeEvent(event), { persistent: true });

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