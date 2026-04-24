const { Schema, model } = require('../connection');

const designSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    format: { type: Object },
    theme: { type: Object },
    title: { type: String },
    subtitle: { type: String },
    footer: { type: String },
    textColors: { type: Object },
    addedQrs: { type: Array },
    addedTexts: { type: Array },
    status: { type: String, default: 'Active' }
}, { timestamps: true });

module.exports = model('Designs', designSchema);
