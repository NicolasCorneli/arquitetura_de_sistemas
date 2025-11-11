// notification/rabbit.js
const amqp = require('amqplib');

let channel = null;

async function connectRabbit() {
  try {
    const connection = await amqp.connect('amqp://admin:admin123@rabbitmq:5672');
    channel = await connection.createChannel();

    const queue = 'notifications';
    await channel.assertQueue(queue, { durable: true });

    console.log('✅ Connected to RabbitMQ and queue ready:', queue);

    // Consome mensagens
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log(`📧 Notification received -> To client ${content.clientId}: ${content.message}`);
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error('❌ Error connecting to RabbitMQ:', err.message);
    setTimeout(connectRabbit, 5000); // tenta reconectar
  }
}

module.exports = { connectRabbit };
