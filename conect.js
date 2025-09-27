const mongoose = require('mongoose');

async function connectToDb(url) {
    return mongoose.connect(url);
}

module.exports = {connectToDb };