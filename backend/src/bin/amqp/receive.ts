import '../../bootstrap';

import { AmqpClient } from '@core/amqp/AmqpClient';

function onMessage(data: object): void {
    console.log('Обработка', data);
}

async function doIt() {
    const amqp = new AmqpClient();
    await amqp.init();

    await amqp.consume('hello', onMessage);
}

doIt();
