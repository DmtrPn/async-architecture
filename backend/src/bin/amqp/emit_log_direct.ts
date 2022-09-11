import '../../bootstrap';

import { AmqpPublisherClient } from '@core/amqp/AmqpPublisherClient';

async function doIt() {
    const amqp = new AmqpPublisherClient({ type: 'direct', exchange: 'direct_logs' });
    await amqp.init();

    for (let routingKey of ['info', 'info', 'warn', 'error']) {
        await amqp.send({ routingKey, data: { msg: `${routingKey} Hello World!` } });
    }
    await amqp.dispose();
}

doIt();
