import '../../bootstrap';

import { AmqpPublisherClient } from '@core/amqp/AmqpPublisherClient';

async function doIt() {
    const amqp = new AmqpPublisherClient({ type: 'topic', exchange: 'topic_logs' });
    await amqp.init();

    for (let routingKey of ['kern.info', 'system.info', 'kern.warn', 'system.error']) {
        await amqp.send({ routingKey, data: { msg: `${routingKey} Hello World!` } });
    }
    await amqp.dispose();
}

doIt();
