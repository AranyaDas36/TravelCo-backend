const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  itinerary: {
    type: [String],
    required: true,
  },
  videoUrl: {
    type: String,
  },imageUrl: {
    type: String, 

  },
  thumbnailUrl: {
    type: String,
  },
  galleryImages: {
    type: [String],
    default: [],
  },
});

module.exports = mongoose.model('Package', packageSchema);
