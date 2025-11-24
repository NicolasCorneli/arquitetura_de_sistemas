// orders/src/kafka/producer.js
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "orders-service",
  brokers: ["kafka:9092"]
});

const producer = kafka.producer();

async function sendOrderToKafka(orderData) {
  await producer.connect();

  await producer.send({
    topic: "orders-payments",
    messages: [
      { value: JSON.stringify(orderData) }
    ]
  });

  console.log("📤 Order enviada ao tópico orders-payments");
}

module.exports = { sendOrderToKafka };
