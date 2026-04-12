const router  = require("express").Router();
const webpush = require("web-push");
const PushSubscription = require("../models/PushSubscription");
const { authRequired } = require("../middleware/auth.middleware");

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Guardar suscripción del navegador
router.post("/subscribe", authRequired, async (req, res) => {
  try {
    const { endpoint, keys } = req.body;
    const userId = req.user.userId;
    await PushSubscription.findOneAndUpdate(
      { userId, endpoint },
      { userId, endpoint, keys },
      { upsert: true, new: true }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Endpoint para enviar notificación (uso interno / testing)
router.post("/send", authRequired, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title = "RPGLog", body = "Tienes misiones pendientes" } = req.body;
    const subs = await PushSubscription.find({ userId });
    const payload = JSON.stringify({ title, body });
    await Promise.allSettled(
      subs.map(s => webpush.sendNotification(
        { endpoint: s.endpoint, keys: s.keys },
        payload
      ))
    );
    res.json({ ok: true, sent: subs.length });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

// Obtener VAPID public key (el frontend la necesita para suscribirse)
router.get("/vapid-key", (req, res) => {
  res.json({ ok: true, publicKey: process.env.VAPID_PUBLIC_KEY });
});

module.exports = router;
