const express = require('express');
const { fcm } = require('../firebase/admin');

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
    console.log('Test notification sent:', response);
    res.status(200).json({ message: 'Test notification sent successfully' });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({ error: 'Failed to send test notification' });
  }
});

module.exports = router;
