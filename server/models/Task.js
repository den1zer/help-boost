const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['volunteering', 'aid', 'other'] },
  points: { type: Number, required: true, default: 100 },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  filePath: { type: String },
  status: { type: String, enum: ['open', 'in_progress', 'completed'], default: 'open' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  submission: { type: mongoose.Schema.Types.ObjectId, ref: 'Contribution', default: null },
  
  
  abandonReason: { type: String } 

}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);