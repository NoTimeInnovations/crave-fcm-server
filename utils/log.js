const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../data/log.json');

function log(message, type = 'normal') {
    const logEntry = {
        timestamp: new Date().toISOString(),
        message: message,
        type: type
    };

    console.log(message);

    fs.readFile(logFilePath, 'utf8', (err, data) => {
        let logs = [];
        if (!err && data) {
            logs = JSON.parse(data);
        }
        logs.push(logEntry);

        fs.writeFile(logFilePath, JSON.stringify(logs, null, 2), (err) => {
            if (err) {
                console.error('Error writing to log file', err);
            }
        });
    });
}

log.error = function(message) {
    log(message, 'error');
};

log.notification = function(message) {
    log(message, 'notification');
};

module.exports = log;