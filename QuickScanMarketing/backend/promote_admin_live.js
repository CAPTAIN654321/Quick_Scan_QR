
const mongoose = require('mongoose');

// Use the exact connection string from connection.js
const url = 'mongodb+srv://mydb12:xhda@cluster0.hvixjfz.mongodb.net/mydb?appName=Cluster0';

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, default: 'user' }
});

const User = mongoose.model('user', userSchema);

async function promote() {
    try {
        await mongoose.connect(url);
        console.log('Connected to DB');
        
        const email = 'rahulvarma100000@gmail.com';
        const result = await User.findOneAndUpdate(
            { email },
            { role: 'admin' },
            { new: true }
        );
        
        if (result) {
            console.log(`SUCCESS: User ${email} is now an ADMIN.`);
        } else {
            // If user doesn't exist, create them
            const newUser = new User({
                name: "Rahul Varma",
                email: email,
                password: "password", // Default password if creating
                role: 'admin'
            });
            await newUser.save();
            console.log(`SUCCESS: Created new ADMIN user ${email}.`);
        }
    } catch (err) {
        console.error('ERROR:', err);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
}

promote();
