import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Clock, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

interface RestaurantCardProps {
  restaurant: {
    id: string;
    name: string;
    category: string;
    priceRange: string;
    rating: number;
    reviewsCount: number;
    address: string;
    imageUrl: string;
    openingHours: string;
  };
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-surface-container"
    >
      <Link to={`/restaurant/${restaurant.id}`}>
        <div className="relative h-48 sm:h-56">
          <img
            src={restaurant.imageUrl || `https://picsum.photos/seed/${restaurant.id}/800/600`}
            alt={restaurant.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm">
            {restaurant.category}
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-headline font-bold text-on-surface leading-tight">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 bg-secondary-container/20 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-secondary fill-secondary" />
              <span className="text-sm font-bold text-on-surface">{restaurant.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-on-surface-variant text-xs font-medium mb-4">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              <span>{restaurant.priceRange}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{restaurant.openingHours}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-on-surface-variant text-sm border-t border-surface-container pt-4">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="truncate">{restaurant.address}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RestaurantCard;
