import '../../bootstrap';

import { AmqpClient } from '@core/amqp/AmqpClient';
import { FakeParams } from '@core/test/FakeParams';

function onMessage(data: object): void {
    const timeout = FakeParams.getInteger({ min: 1, max: 3 });
    console.log(' [x] Received %s', data);
    setTimeout(function () {
        console.log(' [x] Done');
    }, timeout * 1000);

}

async function doIt() {
    const amqp = new AmqpClient();
    await amqp.init();

    await amqp.consume('hello', onMessage);
}

doIt();
