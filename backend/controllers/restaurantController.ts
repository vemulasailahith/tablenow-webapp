import Restaurant from '../models/Restaurant';

export const getRestaurants = async (req: any, res: any) => {
  const restaurants = await Restaurant.find({});
  res.json(restaurants);
};

export const getRestaurantById = async (req: any, res: any) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404).json({ message: 'Restaurant not found' });
  }
};

export const createRestaurant = async (req: any, res: any) => {
  const restaurant = new Restaurant(req.body);
  const createdRestaurant = await restaurant.save();
  res.status(201).json(createdRestaurant);
};
