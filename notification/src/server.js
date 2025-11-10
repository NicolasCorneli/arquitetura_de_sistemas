const express = require('express');
const app = express();

app.use(express.json());

app.get('/notification-service/v1/health', (req, res) => {
  res.json({ ok: true, service: 'notification' });
});

// endpoint de notificação simples (mock)
app.post('/notification-service/v1/notify', (req, res) => {
  const payload = req.body || {};
  console.log('🔔 Notification payload:', payload);
  return res.status(200).json({ status: 'sent', payload });
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`✅ Notification service running on port ${PORT}`);
});
