import '../../bootstrap';

import { AmqpSimpleClient } from '@core/amqp/AmqpSimpleClient';

async function doIt() {
    const amqp = new AmqpSimpleClient();
    await amqp.init();

    for (let i in [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
        await amqp.sendToQueue('hello', { msg: `${i} Hello World!` });
    }
    await amqp.dispose();
}

doIt();
