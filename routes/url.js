const express = require('express');
const router = express.Router();
const Url = require('../model/url');
const { handleGenerateShortUrl, handleGetAnalytics } = require('../controller/url');

router.post('/', handleGenerateShortUrl);
router.get('/analytics/:shortId', handleGetAnalytics)

module.exports = router;