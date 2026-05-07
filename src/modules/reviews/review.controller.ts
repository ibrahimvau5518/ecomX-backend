import { Request, Response } from 'express';
import Review from './review.model';
import { AuthRequest } from '../../middlewares/auth.middleware';

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { rating, comment, itemId } = req.body;
        
        const review = await Review.create({
            rating,
            comment,
            itemId,
            userId: req.user?._id
        });

        res.status(201).json(review);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get reviews for an item
// @route   GET /api/reviews/item/:itemId
// @access  Public
export const getItemReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const reviews = await Review.find({ itemId: req.params.itemId }).populate('userId', 'name');
        res.json(reviews);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            res.status(404).json({ message: 'Review not found' });
            return;
        }

        // Check if user is the owner of the review or an admin
        if (review.userId.toString() !== req.user?._id?.toString() && req.user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'User not authorized to delete this review' });
            return;
        }

        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: 'Review removed successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};