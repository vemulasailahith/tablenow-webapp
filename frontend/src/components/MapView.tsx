import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  restaurants: any[];
  nearbyRestaurants?: any[];
  userLocation?: [number, number] | null;
  center: [number, number];
}

// Custom icons
const UserIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const DBIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const NearbyIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const MapView: React.FC<MapViewProps> = ({ restaurants, nearbyRestaurants = [], userLocation, center }) => {
  return (
    <div className="h-[400px] sm:h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* User Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={UserIcon}>
            <Popup>
              <div className="p-1 font-bold">You are here</div>
            </Popup>
          </Marker>
        )}

        {/* Database Restaurants */}
        {restaurants.map((restaurant) => (
          restaurant.location?.lat && restaurant.location?.lng && (
            <Marker 
              key={restaurant._id} 
              position={[restaurant.location.lat, restaurant.location.lng]}
              icon={DBIcon}
            >
              <Popup className="custom-popup">
                <div className="p-2 w-48">
                  {restaurant.imageUrl && (
                    <img 
                      src={restaurant.imageUrl} 
                      alt={restaurant.name} 
                      className="w-full h-24 object-cover rounded-xl mb-2"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <h3 className="font-headline font-bold text-sm">{restaurant.name}</h3>
                  <p className="text-xs text-on-surface-variant mb-2">{restaurant.category}</p>
                  <p className="text-[10px] text-on-surface-variant mb-3 line-clamp-2">{restaurant.address}</p>
                  <a 
                    href={`/restaurant/${restaurant._id}`}
                    className="block text-center py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Book Now
                  </a>
                </div>
              </Popup>
            </Marker>
          )
        ))}

        {/* Nearby Restaurants (Nominatim) */}
        {nearbyRestaurants.map((restaurant) => (
          <Marker 
            key={restaurant._id} 
            position={[restaurant.location.lat, restaurant.location.lng]}
            icon={NearbyIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2 w-48">
                <h3 className="font-headline font-bold text-sm">{restaurant.name}</h3>
                <p className="text-xs text-secondary mb-2 font-bold">{restaurant.category}</p>
                <p className="text-[10px] text-on-surface-variant mb-1">{restaurant.address}</p>
                <p className="text-[9px] italic text-on-surface-variant mb-0 opacity-70">Source: OpenStreetMap</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
