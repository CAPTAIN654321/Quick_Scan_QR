
const mongoose = require('mongoose');

// Use the exact connection string from connection.js
const url = 'mongodb+srv://rahulvarma100000_db_user:<db_password>@cluster0.8idkkrw.mongodb.net/?appName=Cluster0';

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, default: 'user' }
});

const User = mongoose.model('user', userSchema);

async function forceSeed() {
    try {
        await mongoose.connect(url);
        console.log('CONNECTED TO DATABASE');
        
        const accounts = [
            { name: 'System Admin', email: 'admin@smartqr.com', password: 'adminpassword123', role: 'admin' },
            { name: 'Rahul Varma', email: 'rahulvarma100000@gmail.com', password: 'password', role: 'admin' }
        ];

        for (const account of accounts) {
            const existing = await User.findOne({ email: account.email });
            if (existing) {
                existing.role = 'admin';
                await existing.save();
                console.log(`UPDATED: ${account.email} is now ADMIN.`);
            } else {
                await new User(account).save();
                console.log(`CREATED: New ADMIN account ${account.email}.`);
            }
        }
        
    } catch (err) {
        console.error('SEED ERROR:', err);
    } finally {
        await mongoose.disconnect();
        console.log('DISCONNECTED');
    }
}

forceSeed();
