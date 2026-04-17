const mongoose = require('mongoose');
const dns = require("node:dns/promises");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
const url = 'mongodb+srv://mydb12:xhda@cluster0.hvixjfz.mongodb.net/mydb?appName=Cluster0';
mongoose.connect(url)
    .then(() => {
        console.log('SUCCESS: Atlas connection works!');
        process.exit(0);
    })
    .catch((err) => {
        console.error('FAILURE: Atlas connection failed:', err.message);
        process.exit(1);
    });
