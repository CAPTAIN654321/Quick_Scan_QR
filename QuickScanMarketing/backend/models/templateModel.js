const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: "General"
  },
  previewImage: {
    type: String,
    default: ""
  },
  config: {
    type: Object, // Holds the default layout/content structure
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Template", templateSchema);
