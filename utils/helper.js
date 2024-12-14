const path = require('path');
const log = require('./log');
const fs = require('fs');

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

module.exports = { readSubscribers, writeSubscribers };