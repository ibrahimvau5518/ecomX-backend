import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import itemRoutes from '../modules/items/item.routes';
import reviewRoutes from '../modules/reviews/review.routes';
import bookingRoutes from '../modules/bookings/booking.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';
import aiRoutes from '../modules/ai/ai.routes';

const router = Router();

// Define module routes here
router.use('/auth', authRoutes);
router.use('/items', itemRoutes);
router.use('/reviews', reviewRoutes);
router.use('/bookings', bookingRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/ai', aiRoutes);
// router.use('/users', userRoutes);
// router.use('/items', itemRoutes);
// ...

router.get('/health', (req, res) => {
    res.json({ success: true, message: 'API is running optimally' });
});

export default router;