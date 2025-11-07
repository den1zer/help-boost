// server/models/Skin.js
const mongoose = require('mongoose');
const SkinSchema = new mongoose.Schema({
  skinId: { type: String, required: true, unique: true }, // 'skin_matrix'
  name: { type: String, required: true }, // 'Матриця'
  previewIcon: { type: String }, // '👾'
  cssClass: { type: String, required: true }, // 'skin-matrix'
  unlockedByBadge: { type: String, required: true, unique: true } // 'points_master_8'
});
module.exports = mongoose.model('Skin', SkinSchema);