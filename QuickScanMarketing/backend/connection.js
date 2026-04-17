const mongoose = require('mongoose');
const dns = require('dns');

<<<<<<< HEAD
const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

=======
dns.setServers(['1.1.1.1', '8.8.8.8']);
>>>>>>> 99d139a8e3b2195aeb3e197847a833d34b605a3d
require('dotenv').config();

const url = process.env.MONGODB_URI || 'mongodb+srv://rahulvarma100000_db_user:<db_password>@cluster0.8idkkrw.mongodb.net/?appName=Cluster0';

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