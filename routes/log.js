const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/log', (req, res) => {
    const logFilePath = path.join(__dirname, '../data/log.json');
    
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read log file' });
        }
        
        try {
            const logData = JSON.parse(data);
            res.json(logData);
        } catch (parseErr) {
            res.status(500).json({ error: 'Failed to parse log file' });
        }
    });
});

module.exports = router;