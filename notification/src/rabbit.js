// notification/src/rabbit.js
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
        try {
          const content = JSON.parse(msg.content.toString());
          // Espera { name, orderId }
          const name = content.name ?? content.clientName ?? 'Cliente';
          const orderId = content.orderId ?? content.order_id ?? 'desconhecido';
          console.log(`${name}, seu pedido foi PAGO com sucesso e será despachado em breve`.replace('{nomeCliente}', name));
          // também um log detalhado se quiser:
          console.log(`📧 Notification received -> name: ${name}, orderId: ${orderId}`);
          channel.ack(msg);
        } catch (e) {
          console.error('❌ Erro ao processar mensagem RabbitMQ:', e.message);
          // rejeita sem requeue para evitar loop infinito (ajuste conforme necessário)
          channel.nack(msg, false, false);
        }
      }
    });
  } catch (err) {
    console.error('❌ Error connecting to RabbitMQ:', err.message);
    setTimeout(connectRabbit, 5000); // tenta reconectar
  }
}

module.exports = { connectRabbit };
