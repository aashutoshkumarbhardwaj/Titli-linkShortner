const mongoose= require('mongoose');

const urlSchema= new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
    
    redirectUrl: {
            type: String,
            required: true,
        },
    totalClicks: {
            type: Number,
            default: 0,
        },
     createdAt: [{timeStamp: {type: Date, default: Date.now}}]
    
});

const Url= mongoose.model('Url', urlSchema);

module.exports= Url;
    