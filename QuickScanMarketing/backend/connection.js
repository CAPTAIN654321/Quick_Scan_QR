const mongoose = require('mongoose');

require('dotenv').config();

const url = process.env.MONGODB_URI || 'mongodb+srv://rahulvarma100000_db_user:1234@cluster0.8idkkrw.mongodb.net/mydb';

mongoose.connect(url)
.then((result) => {
    console.log('--- DATABASE STATUS: CONNECTED ---');
    console.log(`PROVIDER: ${url.includes('mongodb+srv') ? 'Atlas Cloud' : 'Local Nexus'}`);
})
.catch((err) => {
    console.error('--- DATABASE STATUS: OFFLINE ---');
    console.error('Primary connection failed. Check your network or MongoDB cluster status.');
    console.log('Error Details:', err.message);
});

module.exports = mongoose;