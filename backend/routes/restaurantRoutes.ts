import express from 'express';
import { getRestaurants, getRestaurantById, createRestaurant } from '../controllers/restaurantController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', protect, admin, createRestaurant);

export default router;
