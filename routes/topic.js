const express = require('express');
const { fcm } = require('../firebase/admin');
const log = require('../utils/log');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Path to subscribers data file
const subscribersFilePath = path.join(__dirname, '../data/subscribers.json');

// Helper function to read subscribers from file
const readSubscribers = () => {
  try {
    if (fs.existsSync(subscribersFilePath)) {
      const data = fs.readFileSync(subscribersFilePath, 'utf8');
      return data ? JSON.parse(data) : [];
    }
    return [];
  } catch (error) {
    log.error(`Error reading subscribers file: ${error.message}`);
    throw new Error('Failed to read subscribers file');
  }
};

// Helper function to write subscribers to file
const writeSubscribers = (subscribers) => {
  try {
    fs.writeFileSync(subscribersFilePath, JSON.stringify(subscribers, null, 2));
  } catch (error) {
    log.error(`Error writing to subscribers file: ${error.message}`);
    throw new Error('Failed to write to subscribers file');
  }
};

// Subscribe user to a topic
router.post('/subscribe', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    log.error('Token is required for subscription');
    return res.status(400).json({ error: 'Token is required' });
  }

  const topic = 'all-offers';
  const timestamp = new Date().toISOString();

  try {
    // Subscribe the token to the FCM topic
    await fcm.subscribeToTopic([token], topic);

    // Read the existing subscribers from the file
    const subscribers = readSubscribers();

    // Check if token is already subscribed
    if (subscribers.some(subscriber => subscriber.token === token)) {
      return res.status(200).json({ message: 'Token is already subscribed' });
    }

    // Add new subscriber
    subscribers.push({ token, timestamp, topic });

    // Write updated list of subscribers back to the file
    writeSubscribers(subscribers);

    log.notification(`Token subscribed to ${topic}: ${token}`);
    res.status(200).json({ message: 'Token saved and subscribed successfully' });
  } catch (error) {
    log.error(`Error subscribing token to ${topic}: ${error.message}`);
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

// Unsubscribe user from a topic
router.post('/unsubscribe', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    log.error('Token is required for unsubscription');
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const topic = 'all-offers';

    // Unsubscribe from the FCM topic
    await fcm.unsubscribeFromTopic([token], topic);

    // Read the existing subscribers from the file
    const subscribers = readSubscribers();

    // Filter out the unsubscribed token
    const updatedSubscribers = subscribers.filter(subscriber => subscriber.token !== token);

    // Write updated list of subscribers back to the file if necessary
    if (subscribers.length !== updatedSubscribers.length) {
      writeSubscribers(updatedSubscribers);
    }

    log(`Token unsubscribed from ${topic}: ${token}`);
    res.status(200).json({ message: 'Token unsubscribed successfully' });
  } catch (error) {
    log.error(`Error unsubscribing token: ${error.message}`);
    res.status(500).json({ error: 'Failed to unsubscribe' });
  }
});

module.exports = router;
