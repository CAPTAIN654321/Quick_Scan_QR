const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema({

link:{
type:String,
required:true
},
type: {
  type: String,
  default: 'dynamic', // 'static' or 'dynamic'
},

  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template',
    default: null
  },
  customConfig: {
    type: Object,
    default: {}
  },
  scanCount: {
    type: Number,
    default: 0
  },
  scans: [
    {
      timestamp: { type: Date, default: Date.now },
      location: { type: String, default: "Unknown" },
      ip: { type: String, default: "Not captured" },
      userAgent: { type: String, default: "Unknown" },
      browser: { type: String, default: "Unknown" },
      os: { type: String, default: "Unknown" },
      device: { type: String, default: "Unknown" },
      name: { type: String, default: "Anonymous" },
      email: { type: String, default: "Not provided" },
      phoneNumber: { type: String, default: "Not provided" },
      isFraud: { type: Boolean, default: false },
      fraudReason: { type: String, default: "" },
      riskScore: { type: Number, default: 0 }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("QR",qrSchema);