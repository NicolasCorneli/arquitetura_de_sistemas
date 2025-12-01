// payments/src/kafka/consumer.js
const { Kafka } = require("kafkajs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const kafka = new Kafka({
  clientId: "payments-service",
  brokers: ["kafka:9092"]
});

const consumer = kafka.consumer({ groupId: "payments-group" });

async function startKafkaConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "orders-payments", fromBeginning: false });

  console.log("📥 Payments consumer conectado ao tópico orders-payments");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const payload = JSON.parse(message.value.toString());
        console.log("💳 Mensagem recebida no payments:", payload);

        const {
          orderId,
          userId,
          products,
          totalAmount,
        } = payload;

        // Probabilidade de sucesso configurável
        const isSuccess = Math.random() < parseFloat(process.env.PAYMENT_SUCCESS_PROB || "0.7");

        const newPayment = await prisma.payment.create({
          data: {
            id: orderId,
            userId,
            totalAmount,
            status: isSuccess ? "SUCCESS" : "FAILED",
            products: JSON.stringify(products)
          }
        });

        console.log("💾 Pagamento salvo no banco:", newPayment);

      } catch (err) {
        console.error("❌ Erro ao processar mensagem Kafka:", err.message);
      }
    }
  });
}

module.exports = { startKafkaConsumer };
