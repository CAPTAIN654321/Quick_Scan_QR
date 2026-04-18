const mongoose = require('mongoose');
const mongoUri = 'mongodb://127.0.0.1:27017/qscan';

async function checkQrs() {
  await mongoose.connect(mongoUri);
  const QR = mongoose.model('QR', new mongoose.Schema({
    link: String,
    template: mongoose.Schema.Types.ObjectId,
    type: String
  }), 'qrs');

  const qrs = await QR.find().sort({ createdAt: -1 }).limit(5);
  console.log(JSON.stringify(qrs, null, 2));
  await mongoose.disconnect();
}

checkQrs();
