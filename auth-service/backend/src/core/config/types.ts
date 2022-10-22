import { RedisOptions } from 'ioredis';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export enum ConfigName {
    Server = 'server',
    Services = 'services',
    Log = 'log',
    Redis = 'redis',
    Db = 'db',
    RabbitMQ = 'rabbitmq',
    JWT = 'jwt',
}

export interface ServerConfig {
    env: string;
    host: string;
    port: number;
    workers?: number;
    cookieSecret?: string;
}

export interface JWTConfig {
    secret: string;
}

export interface ServicesConfig {
    backend: string;
    lab: string;
    site: string;
    asterisk: string;
}

export interface RedisConfig extends RedisOptions {
    host: string;
    port: number;
}

export interface DbConfig extends PostgresConnectionOptions {
    type: 'postgres';
    host: string;
    database: string;
    username: string;
    password: string;
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

export type ConfigType =
    ServerConfig
    | ServicesConfig
    | RedisConfig
    | DbConfig
    | RabbitMQConfig;
