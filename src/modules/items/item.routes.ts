import { Router } from 'express';
import { createItem, getItems, getItemById, updateItem, deleteItem } from './item.controller';
import { protect } from '../../middlewares/auth.middleware';

const router = Router();

router.route('/')
    .get(getItems)
    .post(protect, createItem);

router.route('/:id')
    .get(getItemById)
    .patch(protect, updateItem)
    .delete(protect, deleteItem);

export default router;