import { AmqpClient, AmqpMetadata } from './AmqpClient';

export const enum Exchange {
    UserStream = 'user-stream',
    User = 'user',
}

export const enum EventName {
    UserCreated = 'UserCreated',
}

export class AmqpPublisherClient extends AmqpClient {

    private static instance: AmqpPublisherClient;
    public static getInstance(): AmqpPublisherClient {
        if (!this.instance) {
            this.instance = new AmqpPublisherClient();
        }

        return this.instance;
    }

    private exchanges: Exchange[] = [Exchange.UserStream, Exchange.User];
    private routing: { [key: string]: [Exchange, string] } = {
        [EventName.UserCreated]: [Exchange.UserStream, `${Exchange.UserStream}.user-created.#`],
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
