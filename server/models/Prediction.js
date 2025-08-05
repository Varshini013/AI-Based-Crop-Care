const mongoose = require('mongoose');

const PredictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  diseaseName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  remedy: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Prediction', PredictionSchema);
