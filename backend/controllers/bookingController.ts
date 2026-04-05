import Booking from '../models/Booking';

export const createBooking = async (req: any, res: any) => {
  const { restaurantId, restaurantName, date, time, guests } = req.body;
  const booking = new Booking({
    user: req.user._id,
    restaurant: restaurantId,
    restaurantName,
    date,
    time,
    guests
  });
  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
};

export const getMyBookings = async (req: any, res: any) => {
  const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(bookings);
};

export const updateBookingStatus = async (req: any, res: any) => {
  const booking = await Booking.findById(req.params.id);
  if (booking) {
    booking.status = req.body.status || booking.status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } else {
    res.status(404).json({ message: 'Booking not found' });
  }
};
