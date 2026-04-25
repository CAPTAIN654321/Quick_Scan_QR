const mongoose = require('mongoose');
require('dotenv').config();

const rawUrl = process.env.MONGODB_URI || 'mongodb+srv://rahulvarma100000_db_user:1234@cluster0.8idkkrw.mongodb.net/test';
const url = rawUrl.split('?')[0]; 

mongoose.connect(url, {
    serverSelectionTimeoutMS: 30000,
    tls: true,
})
.then((result) => {
    console.log('--- DATABASE STATUS: CONNECTED ---');
    console.log(`PROVIDER: ${url.includes('mongodb+srv') ? 'Atlas Cloud' : 'Local Nexus'}`);
})
.catch((err) => {
    console.error('--- DATABASE STATUS: OFFLINE ---');
    console.error('Primary connection failed. Check if MongoDB is running or if your Atlas URI is correct.');
    console.log('Error Details:', err.message);
});

module.exports = mongoose;