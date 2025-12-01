async function sendNotification(req, res) {
  try {
    const { clientId, message } = req.body;

    // Aqui poderíamos enviar email, SMS, push notification, etc.
    console.log(`📢 Notificação enviada para cliente ${clientId}: ${message}`);

    res.status(200).json({
      success: true,
      message: `Notification sent to client ${clientId}`,
    });
  } catch (error) {
    res.status(500).json({ error: "Error sending notification", details: error.message });
  }
}

module.exports = { sendNotification };
