const express = require('express');
const app = express();
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

app.set('strict routing', false);
app.use('/url', urlRoutes);

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