// payments/src/rabbit.js
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

// Agora envia um payload padrão com name e orderId
async function sendNotification(name, orderId) {
  const ch = await connectRabbit();
  if (!ch) {
    console.error('❌ Could not get RabbitMQ channel to send notification');
    return;
  }

  const payload = { name, orderId };
  ch.sendToQueue('notifications', Buffer.from(JSON.stringify(payload)), { persistent: true });
  console.log('📨 Notification sent to queue:', payload);
}

module.exports = { connectRabbit, sendNotification };
