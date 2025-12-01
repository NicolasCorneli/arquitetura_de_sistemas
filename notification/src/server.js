const express = require('express');
const { connectRabbit } = require('./rabbit');

const app = express();
app.use(express.json());

app.get('/notification-service/v1/health', (req, res) => {
  res.json({ ok: true, service: 'notification' });
});

// endpoint opcional para testes diretos via HTTP
app.post('/notification-service/v1/notify', (req, res) => {
  const payload = req.body || {};
  console.log('🔔 Notification payload (HTTP):', payload);
  return res.status(200).json({ status: 'sent', payload });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, async () => {
  console.log(`✅ Notification service running on port ${PORT}`);
  await connectRabbit();
});
