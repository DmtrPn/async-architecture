import log4js from 'log4js';

import { Exchange } from '@aa/types/events';

export interface AmqpMetadata {
    eventId: string; // uuid,
    version: string; // 'v1',
    eventName: string;
    producedAt: Date; // ISO
    data: object;
}

export interface RabbitMQConfig {
    hostname: string;
    port: number;
    username: string;
    vhost: string;
    protocol: string;
    password: string;
    exchange: string;
}

export interface AmqpClientParams {
    config: RabbitMQConfig;
    logger: log4js.Logger;
}

export type AmqpPublisherRoutingParams = [event: string, exchange: Exchange, queue: string][];

export interface AmqpPublisherClientParams extends AmqpClientParams {
    exchanges: Exchange[];
    routing: AmqpPublisherRoutingParams;
}

export interface AmqpConsumerClientParams extends AmqpClientParams {
    routing: [Exchange, string][];
    onMessage(msg: object): void;
}
