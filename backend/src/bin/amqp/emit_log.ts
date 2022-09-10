import '../../bootstrap';

import { AmqpPublisherClient } from '@core/amqp/AmqpPublisherClient';

async function doIt() {
    const amqp = new AmqpPublisherClient();
    await amqp.init({ exchange: 'log' });

    for (let i in [0, 1, 2]) {
        await amqp.send({ data: { msg: `${i} Hello World!` } });
    }
    await amqp.dispose();
}

doIt();
