
const mongoose = require('mongoose');
const SkinSchema = new mongoose.Schema({
  skinId: { type: String, required: true, unique: true }, 
  name: { type: String, required: true }, 
  previewIcon: { type: String }, 
  cssClass: { type: String, required: true }, 
  unlockedByBadge: { type: String, required: true, unique: true } 
});
module.exports = mongoose.model('Skin', SkinSchema);