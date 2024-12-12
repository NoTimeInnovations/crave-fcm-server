const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../data/log.json');

// Helper function to write JSON
function writeJSON(logEntries) {
    fs.writeFile(logFilePath, JSON.stringify(logEntries, null, 2), (err) => {
        if (err) {
            console.error('Error writing to log file', err);
        }
    });
}

// Function to log a message
function log(message, type = 'normal') {
    const logEntry = {
        timestamp: new Date().toISOString(),
        message: message,
        type: type
    };

    console.log(message);

    // Read the existing JSON log file
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        let logEntries = [];

        if (!err && data) {
            try {
                // Parse the existing JSON file
                logEntries = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing JSON log file', parseErr);
            }
        }

        // Add the new log entry
        logEntries.push(logEntry);

        // Write the updated log entries to the JSON file
        writeJSON(logEntries);
    });
}

log.error = function(message) {
    log(message, 'error');
};

log.notification = function(message) {
    log(message, 'notification');
};

module.exports = log;