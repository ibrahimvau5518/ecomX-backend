import { Router } from 'express';
import { createReview, getItemReviews, deleteReview } from './review.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.route('/')
    .post(protect, createReview);

router.route('/item/:itemId')
    .get(getItemReviews);

router.route('/:id')
    .delete(protect, deleteReview);

export default router;