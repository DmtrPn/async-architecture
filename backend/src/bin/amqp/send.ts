import '../../bootstrap';

import { AmqpClient } from '@core/amqp/AmqpClient';

async function doIt() {
    const amqp = new AmqpClient();
    await amqp.init();

    for (let i in [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
        await amqp.sendToQueue('hello', { msg: `${i} Hello World!` });
    }
    await amqp.dispose();
}

doIt();
