const Trip = require('../models/Trip');

// @desc    Get all trips
// @route   GET /api/trips
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({}).sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single trip by ID or ShareID
// @route   GET /api/trips/:id
exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findOne({
      $or: [{ _id: req.params.id }, { shareId: req.params.id }]
    });

    if (trip) {
      res.json(trip);
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    // Attempt to find by shareId if objectId fails
    try {
        const trip = await Trip.findOne({ shareId: req.params.id });
        if(trip) return res.json(trip);
        res.status(404).json({ message: 'Trip not found' });
    } catch (e) {
        res.status(404).json({ message: 'Trip not found' });
    }
  }
};

// @desc    Get trip by Share ID (Public)
// @route   GET /api/trips/shared/:shareId
exports.getSharedTrip = async (req, res) => {
    try {
      const trip = await Trip.findOne({ shareId: req.params.shareId });
      if (trip) {
        res.json(trip);
      } else {
        res.status(404).json({ message: 'Trip not found' });
      }
    } catch (error) {
      res.status(404).json({ message: 'Trip not found' });
    }
};

// @desc    Create a new trip
// @route   POST /api/trips
exports.createTrip = async (req, res) => {
  try {
    const { title, startDate, endDate, destinations, coverImage, shareId } = req.body;
    
    // Basic Validation
    if (!title || !startDate || !endDate) {
        return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    const trip = new Trip({
      title,
      startDate,
      endDate,
      destinations,
      coverImage,
      shareId: shareId || Math.random().toString(36).substr(2, 9)
    });

    const createdTrip = await trip.save();
    res.status(201).json(createdTrip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a trip
// @route   PUT /api/trips/:id
exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip) {
      trip.title = req.body.title || trip.title;
      trip.startDate = req.body.startDate || trip.startDate;
      trip.endDate = req.body.endDate || trip.endDate;
      trip.destinations = req.body.destinations || trip.destinations;
      trip.coverImage = req.body.coverImage || trip.coverImage;

      const updatedTrip = await trip.save();
      res.json(updatedTrip);
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (trip) {
      await trip.deleteOne();
      res.json({ message: 'Trip removed' });
    } else {
      res.status(404).json({ message: 'Trip not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload image
// @route   POST /api/trips/upload
exports.uploadImage = (req, res) => {
    if(!req.file) {
        return res.status(400).send('No file uploaded');
    }
    // Return the path relative to the server
    res.send(`/${req.file.path.replace(/\\/g, "/")}`);
};