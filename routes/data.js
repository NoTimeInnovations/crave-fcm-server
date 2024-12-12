const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/data/:filename', (req, res) => {
    const { filename } = req.params;
    const logFilePath = path.join(__dirname, `../data/${filename}`);
    
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read file' });
        }
        
        res.send(data);  
    });
});

module.exports = router;
