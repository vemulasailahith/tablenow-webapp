import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'], required: true },
  rating: { type: Number, default: 0 },
  reviewsCount: { type: Number, default: 0 },
  address: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  imageUrl: { type: String },
  openingHours: { type: String }
}, { timestamps: true });

export default mongoose.model('Restaurant', restaurantSchema);
