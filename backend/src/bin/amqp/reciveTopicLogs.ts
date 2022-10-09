// import '../../bootstrap';
//
// import { AmqpConsumerClient } from '@core/amqp/AmqpConsumerClient';
//
// function onMessage(data: object): void {
//     console.log(' [x] Received %s', data);
// }
//
// async function doIt() {
//     const amqp = new AmqpConsumerClient({
//         onMessage,
//         exchange: 'topic_logs',
//         pattern: process.argv.slice(2),
//     });
//     await amqp.init({ exclusive: true });
// }
//
// doIt();
