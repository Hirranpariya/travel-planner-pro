const mongoose = require('mongoose');

const activitySchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  isCompleted: { type: Boolean, default: false }
});

const destinationSchema = mongoose.Schema({
  id: { type: String, required: true },
  location: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  departureDate: { type: Date, required: true },
  notes: { type: String },
  imageUrl: { type: String },
  activities: [activitySchema]
});

const tripSchema = mongoose.Schema({
  shareId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  coverImage: { type: String },
  destinations: [destinationSchema],
}, {
  timestamps: true
});

// Convert _id to id for frontend compatibility
tripSchema.method('toJSON', function() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;