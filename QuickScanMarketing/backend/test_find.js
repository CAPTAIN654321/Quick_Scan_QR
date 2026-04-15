const mongoose = require('mongoose');
const QR = require('./models/qrModel');
require('./connection');

setTimeout(async () => {
    try {
        const qrList = await QR.find();
        console.log('Result length:', qrList.length);
        console.log('Result type:', typeof qrList);
        console.log('Is array:', Array.isArray(qrList));
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}, 2000);
