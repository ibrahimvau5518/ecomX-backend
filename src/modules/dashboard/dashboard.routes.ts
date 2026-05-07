import { Router } from 'express';
import { getDashboardStats } from './dashboard.controller';
import { protect, authorize } from '../../middlewares/auth.middleware';
import { UserRole } from '../users/user.model';

const router = Router();

// Only ADMIN users can access dashboard stats
router.get('/stats', protect, authorize(UserRole.ADMIN), getDashboardStats);

export default router;