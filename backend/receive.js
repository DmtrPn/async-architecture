#!/usr/bin/env node

// var amqp = require('amqplib/callback_api');
//
// amqp.connect('amqp://localhost', function(error0, connection) {
//     if (error0) {
//         throw error0;
//     }
//     connection.createChannel(function(error1, channel) {
//         if (error1) {
//             throw error1;
//         }
//
//         var queue = 'hello';
//
//         channel.assertQueue(queue, { durable: false });
//
//         console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);
//
//         channel.consume(queue, function(msg) {
//             console.log(' [x] Received %s', msg.content.toString());
//         }, {
//             noAck: true
//         });
//     });
// });




var amqp = require('amqp-connection-manager');

var QUEUE_NAME = 'hello';
// Handle an incomming message.
var onMessage = function(data) {
    var message = JSON.parse(data.content.toString());
    console.log('receiver: got message', message);
    channelWrapper.ack(data);
};

// Create a connetion manager
var connection = amqp.connect(['amqp://localhost']);
connection.on('connect', function() {
    console.log('Connected!');
});
connection.on('disconnect', function(err) {
    console.log('Disconnected.', err.stack);
});


// Set up a channel listening for messages in the queue.
var channelWrapper = connection.createChannel({
    setup: function(channel) {
        // `channel` here is a regular amqplib `ConfirmChannel`.
        return Promise.all([
            channel.assertQueue(QUEUE_NAME, {durable: true}),
            // channel.prefetch(1),
            channel.consume(QUEUE_NAME, onMessage)
        ]);
    },
});




channelWrapper.waitForConnect()
    .then(function() {
        console.log('Listening for messages');
    });