import { Request, Response } from 'express';
import Booking from './booking.model';
import { AuthRequest } from '../../middlewares/auth.middleware';

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { itemId, quantity, price, status } = req.body;
        
        const booking = await Booking.create({
            userId: req.user?._id,
            itemId,
            quantity,
            price,
            status
        });

        res.status(201).json(booking);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get all bookings (User gets their own, Admin gets all)
// @route   GET /api/bookings
// @access  Private
export const getBookings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        let query = {};
        
        // If the user is not an admin, they can only see their own bookings
        if (req.user?.role !== 'ADMIN') {
            query = { userId: req.user?._id };
        }

        const bookings = await Booking.find(query)
            .populate('userId', 'name email')
            .populate('itemId', 'title price')
            .sort({ createdAt: -1 });

        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Update a booking status / details
// @route   PATCH /api/bookings/:id
// @access  Private
export const updateBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }

        // Check if user is the owner of the booking or an ADMIN
        if (booking.userId.toString() !== req.user?._id?.toString() && req.user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'User not authorized to update this booking' });
            return;
        }

        const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        
        res.json(updatedBooking);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private
export const deleteBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            res.status(404).json({ message: 'Booking not found' });
            return;
        }

        // Check if user is the owner of the booking or an ADMIN
        if (booking.userId.toString() !== req.user?._id?.toString() && req.user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'User not authorized to delete this booking' });
            return;
        }

        await Booking.findByIdAndDelete(req.params.id);
        res.json({ message: 'Booking removed successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};