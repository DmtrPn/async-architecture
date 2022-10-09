import { v4 as uuid } from 'uuid';

import { Exchange, TaskEvent } from 'aa-types/events';

import { AmqpClient, AmqpMetadata } from './AmqpClient';

function makeRoutingPrams(exchange: Exchange, queue: string):  [Exchange, string] {
    return [exchange, `${exchange}.${queue}.#`];
}

export class AmqpPublisherClient extends AmqpClient {

    private static instance: AmqpPublisherClient;
    public static getInstance(): AmqpPublisherClient {
        if (!this.instance) {
            this.instance = new AmqpPublisherClient();
        }

        return this.instance;
    }

    private exchanges: Exchange[] = [Exchange.User, Exchange.UserStream];
    private routing: { [key: string]: [Exchange, string] } = {
        [TaskEvent.Created]: makeRoutingPrams(Exchange.TaskStream, 'user-created'),
        [TaskEvent.Updated]: makeRoutingPrams(Exchange.TaskStream, 'user-updated'),
        [TaskEvent.Assigned]: makeRoutingPrams(Exchange.Task, 'task-assigned'),
        [TaskEvent.Executed]: makeRoutingPrams(Exchange.Task, 'task-executed'),
    };

    private constructor() {
        super();
    }

    public send<T extends Omit<AmqpMetadata, 'eventId'>>(event: T): void {
        const [exchange, routingKey] = this.routing[event.eventName]!;
        const witId = { ...event, eventId: uuid() };

        try {
            this.channel.publish(exchange, routingKey, this.serializeEvent(witId), { persistent: true });

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
