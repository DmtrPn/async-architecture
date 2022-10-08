import '../../bootstrap';

import { AmqpSimpleClient } from '@core/amqp/AmqpSimpleClient';

function onMessage(data: object): void {
    console.log(' [x] Received %s', data);
}

async function doIt() {
    const amqp = new AmqpSimpleClient();
    await amqp.init();

    await amqp.consume('hello', onMessage);
}

doIt();
