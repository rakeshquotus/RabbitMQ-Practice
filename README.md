# RabbitMQ Notes

** Notes **: 
1. ch.ack(msg):- 
Acknowledges a message — tells RabbitMQ the message was successfully processed.
✅ Message is removed from the queue.
Use it after successful processing.
`ch.ack(msg)`

2. ch.nack(msg, allUpTo = false, requeue = true)
Negative acknowledgment — tells RabbitMQ the message was not processed.
If requeue = true, the message goes back to the queue.
If requeue = false, and DLX is set, it goes to DLQ.
`ch.nack(msg, false, false); // Send to DLQ`

3. ch.reject(msg, requeue = false)
Similar to nack, but cannot be used to reject multiple messages.
`ch.reject(msg, false);`

4. ch.prefetch(count)
Limits the number of unacknowledged messages a consumer can hold.
Prevents flooding the worker.
Example: ch.prefetch(1) ensures one message at a time.
`ch.prefetch(1);`

5. ch.assertQueue(name, options)
Declares a queue. If it doesn’t exist, it creates it.
`await ch.assertQueue('my_queue', { durable: true });`

6. ch.assertExchange(name, type, options)
Declares an exchange.
`await ch.assertExchange('my_exchange', 'direct', { durable: true });`


7. ch.bindQueue(queue, exchange, routingKey)
Binds a queue to an exchange with a routing key.
`await ch.bindQueue('my_queue', 'my_exchange', 'my.key');`



📬 Publishing & Consuming
8. ch.sendToQueue(queue, Buffer.from(message), options)
Sends a message to a specific queue.
`ch.sendToQueue('email_queue', Buffer.from('hello@example.com'));`

9. ch.publish(exchange, routingKey, Buffer.from(message), options)
Publishes to an exchange (used with direct, topic, fanout, etc.).
`ch.publish('my_exchange', 'my.key', Buffer.from('Hello'));`

10. ch.consume(queue, callback, options)
Starts consuming messages from a queue.
`ch.consume('my_queue', async (msg) => {}, { noAck: false });`