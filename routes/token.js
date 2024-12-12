const express = require('express');
const { fcm } = require('../firebase/admin');
const log = require('../utils/log');

const router = express.Router();

// Save FCM token and subscribe to topic
router.post('/save-token', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token is required' });

  try {
    await fcm.subscribeToTopic([token], 'new-offers');
    log('Subscribed to new-offers');
    res.status(200).json({ message: 'Token saved and subscribed successfully' });
  } catch (error) {
    log.error('Error subscribing token:', error);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Unsubscribe FCM token from topic
router.post('/unsubscribe-token', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token is required' });

  try {
    await fcm.unsubscribeFromTopic([token], 'new-offers');
    log('Unsubscribed from new-offers');
    res.status(200).json({ message: 'Token unsubscribed successfully' });
  } catch (error) {
    log.error('Error unsubscribing token:', error);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

module.exports = router;
