const express = require('express');
const app = express();
const path = require('path');
const { connectToDb } = require('./conect');
const URL = require('./model/url');

const port = 3000;
const urlRoutes = require('./routes/url');

connectToDb('mongodb://localhost:27017/shorturl')
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.error('Error connecting to DB', err);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'view'));

app.set('strict routing', false);
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
        await URL.create({ shortId, redirectUrl });
        const shortUrl = `${req.protocol}://${req.get('host')}/${shortId}`;
        res.render('home', { shortUrl, error: null });
    } catch (err) {
        res.render('home', { shortUrl: null, error: 'Something went wrong. Please try again.' });
    }
});

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        { shortId: shortId },
        {
            $inc: { totalClicks: 1 },
            $push: { createdAt: { timeStamp: new Date() } },
        }
    );
    if (entry) {
        return res.redirect(entry.redirectUrl);
    } else {
        return res.status(404).send('URL not found');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});