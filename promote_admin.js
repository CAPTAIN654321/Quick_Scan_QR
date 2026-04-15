
const mongoose = require('mongoose');
const Model = require('./QuickScanMarketing/backend/models/userModel');
require('dotenv').config({ path: './QuickScanMarketing/backend/.env' });

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/qscan');
        const email = 'rahulvarma100000@gmail.com';
        const user = await Model.findOne({ email });
        
        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`User ${email} promoted to admin.`);
        } else {
            console.log(`User ${email} not found.`);
        }
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
}

createAdmin();
