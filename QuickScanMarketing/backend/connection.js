const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

require('dotenv').config();

const url = process.env.MONGODB_URI || 'mongodb+srv://rahulvarma100000_db_user:1234@cluster0.8idkkrw.mongodb.net/?appName=Cluster0';

mongoose.connect(url, {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
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