import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Calendar, Clock, Users, ChevronRight, XCircle, CheckCircle, Clock4 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data);
    } catch (error) {
      console.error('Fetch bookings error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      await api.put(`/bookings/${id}`, { status: 'canceled' });
      fetchBookings();
    } catch (error) {
      console.error('Cancel booking error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'canceled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock4 className="w-5 h-5 text-primary" />;
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-2">
            Namaste, {profile?.name}!
          </h1>
          <p className="text-on-surface-variant text-lg">Manage your upcoming and past dining experiences.</p>
        </header>

        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-headline font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Your Bookings
            </h2>

            <div className="space-y-4">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 bg-surface-container-low rounded-3xl animate-pulse" />
                ))
              ) : bookings.length > 0 ? (
                bookings.map((booking) => (
                  <motion.div
                    key={booking._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-surface-container-low p-6 rounded-[2rem] border border-surface-container hover:bg-surface-container-high transition-all duration-300 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-headline font-extrabold text-2xl">
                          {booking.restaurantName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-headline font-bold text-on-surface mb-1 group-hover:text-primary transition-colors">
                            {booking.restaurantName}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant font-medium">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              <span>{format(new Date(booking.date), 'EEE, MMM d')}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>{booking.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4" />
                              <span>{booking.guests} guests</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest ${
                          booking.status === 'upcoming' ? 'bg-primary/10 text-primary' :
                          booking.status === 'completed' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </div>
                        
                        {booking.status === 'upcoming' && (
                          <button
                            onClick={() => handleCancel(booking._id)}
                            className="p-3 rounded-full bg-surface-container-high text-on-surface-variant hover:bg-red-50 hover:text-red-500 transition-all duration-300"
                            title="Cancel Booking"
                          >
                            <XCircle className="w-6 h-6" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-20 bg-surface-container-low rounded-[2rem] border-2 border-dashed border-surface-container">
                  <Calendar className="w-12 h-12 text-on-surface-variant mx-auto mb-4 opacity-20" />
                  <p className="text-on-surface-variant text-lg font-medium mb-6">You haven't made any bookings yet.</p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="px-8 py-4 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300"
                  >
                    Explore Restaurants
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
