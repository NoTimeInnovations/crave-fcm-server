const express = require('express');
const { fcm } = require('../firebase/admin');
const log = require('../utils/log');

const router = express.Router();

router.get('/test', async (req, res) => {
  try {
    const message = {
      notification: {
        title: 'Test Notification',
        body: 'Hello, world!',
      },
      topic: 'new-offers',
    };

    const response = await fcm.send(message);
    log('Test notification sent:', response);
    res.status(200).json({ message: 'Test notification sent successfully' });
  } catch (error) {
    log.error('Error sending test notification:', error);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

module.exports = router;
