import '../../bootstrap';

import { AmqpClient } from '@core/amqp/AmqpClient';

async function doIt() {
    const amqp = new AmqpClient();
    await amqp.init();

    await amqp.sendToQueue('hello', { msg: 'Hello World!' });
    await amqp.dispose();
}

doIt();
