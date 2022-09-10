import '../../bootstrap';

import { AmqpPublisherClient } from '@core/amqp/AmqpConsumerClient';

function onMessage(data: object): void {
    console.log(' [x] Received %s', data);
}

async function doIt() {
    const amqp = new AmqpPublisherClient();
    await amqp.init({ onMessage, exclusive: true, exchange: 'log' });

    // await amqp.consumeExclusiveExchange(onMessage);
}

doIt();
