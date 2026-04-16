const { Schema, model } = require('mongoose');

const mySchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    status: { type: String, default: 'approved', enum: ['pending', 'approved', 'rejected'] },
    address: {
        fullName: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    resetOtp: String,
    resetOtpExpires: Date
}, { timestamps: true });

module.exports = model('Users', mySchema);