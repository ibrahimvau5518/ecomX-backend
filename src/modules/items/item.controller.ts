import { Request, Response } from 'express';
import Item from './item.model';
import { AuthRequest } from '../../middlewares/auth.middleware';

// @desc    Create an item
// @route   POST /api/items
// @access  Private
export const createItem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, image, price, location, category } = req.body;
        
        const newItem = await Item.create({
            title,
            description,
            image,
            price,
            location,
            category,
            createdBy: req.user?._id,
        });

        res.status(201).json(newItem);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get all items
// @route   GET /api/items
// @access  Public
export const getItems = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            search, 
            category, 
            minPrice, 
            maxPrice, 
            minRating, 
            sortBy, 
            sortOrder, 
            page = '1', 
            limit = '10' 
        } = req.query;

        // Build query object
        const query: any = {};

        // Search by title, description, or category
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        // Apply strict category filter if search is not managing it uniquely
        if (category) {
            query.category = { $regex: category, $options: 'i' };
        }

        // Price filter
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Rating filter
        if (minRating) {
            query.rating = { $gte: Number(minRating) };
        }

        // Sorting
        let sortOptions: any = { createdAt: -1 }; // Default sort by newest
        if (sortBy === 'price' || sortBy === 'rating' || sortBy === 'createdAt') {
            sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        }

        // Pagination
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        // Execute Queries
        const total = await Item.countDocuments(query);
        const items = await Item.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum)
            .populate('createdBy', 'name email');

        res.json({
            items,
            meta: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum)
            }
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Get item by ID
// @route   GET /api/items/:id
// @access  Public
export const getItemById = async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await Item.findById(req.params.id).populate('createdBy', 'name email');
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Update item
// @route   PATCH /api/items/:id
// @access  Private
export const updateItem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }

        // Check if user is the creator or an admin
        if (item.createdBy.toString() !== req.user?._id?.toString() && req.user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'User not authorized to update this item' });
            return;
        }

        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        
        res.json(updatedItem);
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const item = await Item.findById(req.params.id);

        if (!item) {
            res.status(404).json({ message: 'Item not found' });
            return;
        }

        // Check if user is the creator or an admin
        if (item.createdBy.toString() !== req.user?._id?.toString() && req.user?.role !== 'ADMIN') {
            res.status(403).json({ message: 'User not authorized to delete this item' });
            return;
        }

        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item removed successfully' });
    } catch (error: any) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};