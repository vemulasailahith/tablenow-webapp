import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Star, MapPin, Clock, DollarSign, Users, Calendar, ChevronRight, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { format } from 'date-fns';

const RestaurantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDate, setBookingDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [bookingTime, setBookingTime] = useState('19:00');
  const [guests, setGuests] = useState(2);
  const [isBooking, setIsBooking] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!id) return;
      try {
        const { data } = await api.get(`/restaurants/${id}`);
        setRestaurant(data);
      } catch (error) {
        console.error('Fetch restaurant error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsBooking(true);
    setMessage(null);

    try {
      await api.post('/bookings', {
        restaurantId: id,
        restaurantName: restaurant.name,
        date: bookingDate,
        time: bookingTime,
        guests,
      });
      setMessage({ type: 'success', text: 'Table booked successfully!' });
      setTimeout(() => navigate('/bookings'), 2000);
    } catch (error) {
      console.error("Booking error:", error);
      setMessage({ type: 'error', text: 'Failed to book table. Please try again.' });
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) return <Layout><div className="h-screen flex items-center justify-center">Loading...</div></Layout>;
  if (!restaurant) return <Layout><div className="h-screen flex items-center justify-center">Restaurant not found.</div></Layout>;

  const timeSlots = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pb-32">
        {/* Hero Image */}
        <section className="relative h-[400px] sm:h-[500px] w-full overflow-hidden sm:rounded-b-[3rem] shadow-2xl">
          <img
            src={restaurant.imageUrl || `https://picsum.photos/seed/${restaurant._id}/1200/800`}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <div className="flex justify-between items-end">
              <div>
                <span className="px-4 py-1.5 rounded-full bg-primary text-white font-bold text-xs uppercase tracking-widest mb-4 inline-block">
                  {restaurant.category}
                </span>
                <h1 className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tight mb-2">
                  {restaurant.name}
                </h1>
                <div className="flex items-center gap-4 text-sm font-medium opacity-90">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span>{restaurant.rating} ({restaurant.reviewsCount}+ reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurant.address}</span>
                  </div>
                </div>
              </div>
              <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/40 transition-colors">
                <Heart className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </section>

        <div className="px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Details Column */}
          <div className="md:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-headline font-bold mb-4">About</h2>
              <p className="text-on-surface-variant leading-relaxed text-lg">
                {restaurant.description}
              </p>
            </section>

            <section className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-low p-6 rounded-3xl">
                <DollarSign className="w-6 h-6 text-primary mb-3" />
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Price Range</p>
                <p className="font-bold text-lg">{restaurant.priceRange} • Premium</p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-3xl">
                <Clock className="w-6 h-6 text-secondary mb-3" />
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Hours</p>
                <p className="font-bold text-lg">Open until 11:00 PM</p>
              </div>
            </section>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-8">
            <div className="bg-surface-container-lowest p-8 rounded-[2rem] shadow-xl border border-surface-container sticky top-32">
              <h3 className="text-xl font-headline font-bold mb-6">Reserve a Table</h3>
              
              <div className="space-y-6">
                {/* Date Selection */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 ml-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                    <input
                      type="date"
                      min={format(new Date(), 'yyyy-MM-dd')}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>
                </div>

                {/* Time Slots */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 ml-1">Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setBookingTime(time)}
                        className={`py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                          bookingTime === time 
                            ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Guests */}
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 ml-1">Guests</label>
                  <div className="flex items-center justify-between bg-surface-container-low rounded-2xl px-4 py-2">
                    <button 
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
                    >
                      -
                    </button>
                    <span className="font-headline font-extrabold text-lg">{guests}</span>
                    <button 
                      onClick={() => setGuests(guests + 1)}
                      className="w-10 h-10 rounded-full flex items-center justify-center text-primary hover:bg-surface-container-high transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {message && (
                  <div className={`p-4 rounded-2xl text-sm font-bold text-center ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {message.text}
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="w-full py-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-headline font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300 disabled:opacity-50"
                >
                  {isBooking ? 'Booking...' : 'Book Table'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RestaurantDetails;
