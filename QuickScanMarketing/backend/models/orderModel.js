const { Schema, model } = require('../connection');

const orderSchema = new Schema({
    format: { type: Object },
    theme: { type: Object },
    title: { type: String },
    subtitle: { type: String },
    addedQrs: { type: Array },
    addedTexts: { type: Array },
    totalPrice: { type: Number },
    quantity: { type: Number, default: 1 },
    status: { type: String, default: 'Pending' },
    paymentStatus: { type: String, default: 'Pending' },
    paymentMethod: { type: String, default: 'Credit Card' },
    deliveryAgentNumber: { type: String, default: '' },
    address: {
        fullName: String,
        email: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    }
}, { timestamps: true });

module.exports = model('Orders', orderSchema);
