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
    paymentStatus: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = model('Orders', orderSchema);
