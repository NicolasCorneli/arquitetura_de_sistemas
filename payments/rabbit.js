// payments/src/utils/rabbit.js
const amqp = require('amqplib');

let channel;

async function connectRabbit() {
  if (channel) return channel;
  try {
    const connection = await amqp.connect('amqp://admin:admin123@rabbitmq:5672');
    channel = await connection.createChannel();
    await channel.assertQueue('notifications', { durable: true });
    console.log('📡 Payments connected to RabbitMQ');
    return channel;
  } catch (err) {
    console.error('❌ Error connecting to RabbitMQ:', err.message);
    setTimeout(connectRabbit, 5000); // tenta reconectar
  }
}

async function sendNotification(clientId, message) {
  const ch = await connectRabbit();
  const payload = { clientId, message };

  ch.sendToQueue('notifications', Buffer.from(JSON.stringify(payload)), { persistent: true });
  console.log('📨 Notification sent to queue:', payload);
}

module.exports = { connectRabbit, sendNotification };
