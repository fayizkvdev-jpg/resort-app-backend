import { Router } from 'express';
import { createBooking, getAllBookings, getUserBookings, updateBookingStatus } from '../controllers/booking.controller';
import { protect, admin } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', protect, createBooking);
router.get('/', protect, admin, getAllBookings);
router.get('/my', protect, getUserBookings);
router.patch('/:id/status', protect, admin, updateBookingStatus);

export default router;
