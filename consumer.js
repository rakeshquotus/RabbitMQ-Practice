const amqp = require("amqplib");
const { letsTest } = require("./nodemailer");

const MAIN_QUEUE = "email_queue";
const RETRY_QUEUE = "email_retry_queue";
const DLQ_QUEUE = "email_dlq";
const MAX_RETRIES = 3;

async function receiveTasks() {
  const conn = await amqp.connect("amqp://localhost");
  const ch = await conn.createChannel();

  // Setup queues
  await ch.assertQueue(DLQ_QUEUE, { durable: true });

  await ch.assertQueue(RETRY_QUEUE, {
    durable: true,
    deadLetterExchange: "",
    //this setup will send the message back to main queue
    deadLetterRoutingKey: MAIN_QUEUE,
    messageTtl: 5000, // Wait 5s before retry
  });

  await ch.assertQueue(MAIN_QUEUE, {
    durable: true,
    deadLetterExchange: "",
    deadLetterRoutingKey: DLQ_QUEUE, // default dead-letter to DLQ
  });

  ch.prefetch(1); // Fair dispatch
  console.log("prefetch setup successfull");

  ch.consume(
    MAIN_QUEUE,
    async (msg) => {
      const content = msg.content.toString();
      const headers = msg.properties.headers || {};
      const attempts = headers["x-retries"] || 0;

      console.log(`\n🔔 Received: ${content} | Retry attempt: ${attempts}`);

      let success = false;
      try {
        success = await letsTest(content);
      } catch (err) {
        console.error("Error in letsTest:", err);
      }

      if (success) {
        console.log(`✅ Email sent to: ${content}`);
        ch.ack(msg);
      } else {
        if (attempts < MAX_RETRIES) {
          console.log(`❌ Failed. Retrying (${attempts + 1})...`);

          // Publish to retry queue with incremented retry header
          ch.sendToQueue(RETRY_QUEUE, Buffer.from(content), {
            headers: { "x-retries": attempts + 1 },
            persistent: true,
          });
        } else {
          console.log(`🚫 Max retries exceeded. Sending to DLQ.`);
          ch.sendToQueue(DLQ_QUEUE, Buffer.from(content), {
            headers: { "x-retries": attempts + 1 },
            persistent: true,
          });
        }

        ch.ack(msg); // Always ack original
      }
    },
    { noAck: false }
  );
}

receiveTasks();
