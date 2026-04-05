import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import RestaurantCard from '../components/RestaurantCard';
import MapView from '../components/MapView';
import { Search, Filter, Map as MapIcon, List, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Home: React.FC = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingNearby, setFetchingNearby] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    fetchRestaurants();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          fetchNearbyFromNominatim(latitude, longitude);
        },
        (error) => console.error('Geolocation error:', error)
      );
    }
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data } = await api.get('/restaurants');
      setRestaurants(data);
    } catch (error) {
      console.error('Fetch restaurants error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchNearbyFromNominatim = async (lat: number, lon: number) => {
    setFetchingNearby(true);
    try {
      // Nominatim bounding box: [min_lat, max_lat, min_lon, max_lon]
      // Approx 5km radius
      const delta = 0.05; 
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=restaurant&viewbox=${lon-delta},${lat+delta},${lon+delta},${lat-delta}&bounded=1&limit=15`;
      
      const response = await fetch(url, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.5',
          'User-Agent': 'TableNow-App'
        }
      });
      const data = await response.json();
      
      const formattedNearby = data.map((item: any) => ({
        _id: `nearby-${item.place_id}`,
        name: item.display_name.split(',')[0],
        address: item.display_name.split(',').slice(1, 3).join(','),
        category: 'Nearby Restaurant',
        location: {
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        },
        isNearby: true
      }));
      
      setNearbyRestaurants(formattedNearby);
    } catch (error) {
      console.error('Nominatim fetch error:', error);
    } finally {
      setFetchingNearby(false);
    }
  };

  const handleRefreshNearby = () => {
    if (userLocation) {
      fetchNearbyFromNominatim(userLocation[0], userLocation[1]);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          fetchNearbyFromNominatim(latitude, longitude);
        }
      );
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    if (!userLocation || !a.location?.lat || !b.location?.lat) return 0;
    const distA = calculateDistance(userLocation[0], userLocation[1], a.location.lat, a.location.lng);
    const distB = calculateDistance(userLocation[0], userLocation[1], b.location.lat, b.location.lng);
    return distA - distB;
  });

  const filteredRestaurants = sortedRestaurants.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl sm:text-5xl font-headline font-extrabold tracking-tight text-on-surface mb-4"
          >
            Find your perfect table in India.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-on-surface-variant text-lg max-w-2xl"
          >
            Discover the most iconic Indian dining experiences, curated just for you.
          </motion.p>
        </section>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 sticky top-20 z-40 bg-surface/80 backdrop-blur-md py-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or cuisine..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-surface-container-low border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-surface-container-lowest transition-all duration-300 outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleRefreshNearby}
              disabled={fetchingNearby}
              title="Refresh Nearby"
              className="p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 text-on-surface-variant ${fetchingNearby ? 'animate-spin' : ''}`} />
            </button>
            <button className="p-4 bg-surface-container-low rounded-2xl hover:bg-surface-container-high transition-colors">
              <Filter className="w-5 h-5 text-on-surface-variant" />
            </button>
            <button 
              onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
              className="flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all duration-300"
            >
              {viewMode === 'list' ? (
                <>
                  <MapIcon className="w-5 h-5" />
                  <span>Map View</span>
                </>
              ) : (
                <>
                  <List className="w-5 h-5" />
                  <span>List View</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {viewMode === 'map' ? (
            <motion.div
              key="map"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <MapView 
                restaurants={filteredRestaurants} 
                nearbyRestaurants={nearbyRestaurants}
                userLocation={userLocation}
                center={userLocation || [28.6139, 77.2090]} 
              />
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant._id} restaurant={{ ...restaurant, id: restaurant._id }} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-80 bg-surface-container-low rounded-3xl animate-pulse" />
                ))
              ) : (
                filteredRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant._id} restaurant={{ ...restaurant, id: restaurant._id }} />
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!loading && filteredRestaurants.length === 0 && (
          <div className="text-center py-20">
            <p className="text-on-surface-variant text-lg">No restaurants found matching your search.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
