const express = require('express');
const path = require('path');

const router = express.Router();

router.get("/", (_, res) => {
    return res.sendFile(path.join(__dirname, "../pages/homePage.html"));
});

router.get("/log", (_, res) => {
    return res.sendFile(path.join(__dirname, "../pages/LogPage.html"));
});

router.get("/subscribers", (_, res) => {
    return res.sendFile(path.join(__dirname, "../pages/subscribersPage.html"));
});

router.get("/test", (_, res) => {
    return res.sendFile(path.join(__dirname, "../pages/testPage.html"));
});


module.exports = router;