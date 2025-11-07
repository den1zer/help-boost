const mongoose = require('mongoose');

const ContributionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['donation', 'volunteering', 'aid', 'other'],
  },
  filePath: {
    type: String,
  },
  amount: {
    type: Number, 
  },
  itemList: {
    type: String, 
  },
  comment: {
    type: String, 
  },
  location: {
    lat: Number,
    lng: Number,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  pointsAwarded: {
    type: Number,
    default: 0,
  },
  rejectionComment: {
    type: String,
    default: '',
  }
}, { timestamps: true });

module.exports = mongoose.model('Contribution', ContributionSchema);