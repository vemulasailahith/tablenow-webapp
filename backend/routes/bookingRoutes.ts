import express from 'express';
import { createBooking, getMyBookings, updateBookingStatus } from '../controllers/bookingController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id', protect, updateBookingStatus);

export default router;
