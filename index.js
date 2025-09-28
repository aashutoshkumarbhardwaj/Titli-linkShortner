const express = require('express');
const app = express();
const path = require('path');

const port = 3000;
const urlRoutes = require('./routes/url');

// In-memory "database" to store URLs.
// Note: This data will be lost when the server restarts.
const urlDatabase = new Map();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

app.use('/url', urlRoutes);

// Home page: form to submit URL
app.get('/', (req, res) => {
    res.render('home', { shortUrl: null, error: null });
});

// Handle form submission
app.post('/shorten', async (req, res) => {
    const { redirectUrl } = req.body;
    if (!redirectUrl) {
        return res.render('home', { shortUrl: null, error: 'Please enter a URL.' });
    }
    try {
        const shortId = require('shortid')();
        // Store the new link in our in-memory database
        urlDatabase.set(shortId, {
            redirectUrl: redirectUrl,
            totalClicks: 0,
            createdAt: [],
        });

        const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;
        res.render('home', { shortUrl, error: null });
    } catch (err) {
        // Log the actual error to the server console for debugging
        console.error("Error creating short URL:", err);
        res.render('home', { shortUrl: null, error: 'An unexpected error occurred.' });
    }
});

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    // Find the entry in our in-memory database
    const entry = urlDatabase.get(shortId);

    if (entry) {
        // Update analytics
        entry.totalClicks++;
        entry.createdAt.push({ timeStamp: new Date() });
        return res.redirect(entry.redirectUrl);
    } else {
        return res.status(404).send('URL not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});