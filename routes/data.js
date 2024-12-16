const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Route to read and return the file content
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

// Route to download the file
router.get('/data/:filename/download', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, `../data/${filename}`);

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Send the file as a download
        res.download(filePath, filename, (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to download file' });
            }
        });
    });
});

module.exports = router;
