import '../../bootstrap';

import { AmqpConsumerClient } from '@core/amqp/AmqpConsumerClient';

function onMessage(data: object): void {
    console.log(' [x] Received %s', data);
}

async function doIt() {
    const amqp = new AmqpConsumerClient({ onMessage, exchange: 'direct_logs' });
    await amqp.init({ exclusive: true });
}

doIt();
