import { Router } from 'express';
import { chat, generateDescription, reviewSummary } from './ai.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

// Public / Semi-public AI routes
router.post('/chat', chat);
router.post('/review-summary', reviewSummary);

// Protected AI routes (e.g. for sellers creating items)
router.post('/generate-description', protect, generateDescription);

export default router;