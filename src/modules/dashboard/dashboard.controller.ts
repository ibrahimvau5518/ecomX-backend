import { Request, Response } from 'express';
import User from '../users/user.model';
import Item from '../items/item.model';
import Booking, { BookingStatus } from '../bookings/booking.model';

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        // Run count queries in parallel for better performance
        const [totalUsers, totalItems, totalOrders] = await Promise.all([
            User.countDocuments(),
            Item.countDocuments(),
            Booking.countDocuments()
        ]);

        // Calculate total revenue using MongoDB Aggregation
        // Assuming 'price' in booking is the total transaction amount
        const revenueAggregation = await Booking.aggregate([
            {
                // Optional: Only calculate revenue for completed or confirmed orders
                $match: {
                    status: { $in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$price' } 
                }
            }
        ]);

        const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

        res.json({
            success: true,
            data: {
                totalUsers,
                totalItems,
                totalOrders,
                totalRevenue
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};