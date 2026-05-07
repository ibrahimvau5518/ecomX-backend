import { Router } from 'express';
import { createBooking, getBookings, updateBooking, deleteBooking } from './booking.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

// Protect all booking routes (user must be logged in to book/view their bookings)
router.use(protect);

router.route('/')
    .post(createBooking)
    .get(getBookings);

router.route('/:id')
    .patch(updateBooking)
    .delete(deleteBooking);

export default router;