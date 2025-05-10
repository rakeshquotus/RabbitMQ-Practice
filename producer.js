const amqp = require('amqplib');

async function sendEmails() {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  const queue = 'email_queue';
  const DLQ_QUEUE = "email_dlq"; //dead letter queue
  
  await ch.assertQueue(queue, {
    durable: true,
    deadLetterExchange: "",
    deadLetterRoutingKey: DLQ_QUEUE 
  });

  const emails = ['a@example.com', 'b@example.com', 'c@example.com', 'd@example.com'];

  for (const email of emails) {
    ch.sendToQueue(queue, Buffer.from(email), { persistent: true });
    console.log('📤 Sent:', email);
  }

  setTimeout(() => conn.close(), 500);
}

sendEmails();
