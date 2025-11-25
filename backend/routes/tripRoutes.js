const express = require('express');
const router = express.Router();
const { 
    getTrips, 
    getTripById, 
    createTrip, 
    updateTrip, 
    deleteTrip,
    getSharedTrip,
    uploadImage
} = require('../controllers/tripController');
const upload = require('../middleware/upload');

router.route('/')
    .get(getTrips)
    .post(createTrip);

router.post('/upload', upload.single('image'), uploadImage);

router.get('/shared/:shareId', getSharedTrip);

router.route('/:id')
    .get(getTripById)
    .put(updateTrip)
    .delete(deleteTrip);

module.exports = router;