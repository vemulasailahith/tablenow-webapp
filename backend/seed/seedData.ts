import Restaurant from '../models/Restaurant';

export const seedRestaurants = async () => {
  const count = await Restaurant.countDocuments();
  if (count === 0) {
    const indianRestaurants = [
      {
        name: "Bukhara",
        description: "Iconic North Indian restaurant known for its rustic charm and succulent kebabs.",
        category: "North Indian",
        priceRange: "$$$$",
        rating: 4.8,
        reviewsCount: 2500,
        address: "ITC Maurya, Sardar Patel Marg, New Delhi",
        location: { lat: 28.5975, lng: 77.1736 },
        imageUrl: "https://picsum.photos/seed/bukhara/1200/800",
        openingHours: "12:30 - 14:45, 19:00 - 23:45"
      },
      {
        name: "Indian Accent",
        description: "Modern Indian cuisine that reinterprets traditional flavors with a contemporary twist.",
        category: "Modern Indian",
        priceRange: "$$$$",
        rating: 4.9,
        reviewsCount: 1800,
        address: "The Lodhi, Lodhi Rd, New Delhi",
        location: { lat: 28.5919, lng: 77.2343 },
        imageUrl: "https://picsum.photos/seed/indianaccent/1200/800",
        openingHours: "12:00 - 14:30, 19:00 - 22:30"
      },
      {
        name: "Gajalee",
        description: "Famous for its coastal Maharashtrian seafood, especially the Tandoori Crab.",
        category: "Seafood",
        priceRange: "$$$",
        rating: 4.6,
        reviewsCount: 1200,
        address: "Hanuman Rd, Vile Parle East, Mumbai",
        location: { lat: 19.0989, lng: 72.8524 },
        imageUrl: "https://picsum.photos/seed/gajalee/1200/800",
        openingHours: "11:30 - 15:30, 19:00 - 23:30"
      },
      {
        name: "Karavalli",
        description: "Authentic flavors from the coastal regions of South West India.",
        category: "South Indian",
        priceRange: "$$$",
        rating: 4.7,
        reviewsCount: 900,
        address: "Vivanta Bengaluru, Residency Rd, Bangalore",
        location: { lat: 12.9734, lng: 77.6119 },
        imageUrl: "https://picsum.photos/seed/karavalli/1200/800",
        openingHours: "12:30 - 15:00, 19:00 - 23:30"
      },
      {
        name: "Dum Pukht",
        description: "Grand Awadhi cuisine known for its slow-cooking 'dum' technique.",
        category: "Awadhi",
        priceRange: "$$$$",
        rating: 4.8,
        reviewsCount: 1100,
        address: "ITC Maurya, Sardar Patel Marg, New Delhi",
        location: { lat: 28.5975, lng: 77.1736 },
        imageUrl: "https://picsum.photos/seed/dumpukht/1200/800",
        openingHours: "19:00 - 23:45"
      },
      {
        name: "Peshawri",
        description: "Brings alive the robust flavors of the North West Frontier.",
        category: "North Indian",
        priceRange: "$$$$",
        rating: 4.7,
        reviewsCount: 1500,
        address: "ITC Maratha, Sahar Rd, Mumbai",
        location: { lat: 19.1025, lng: 72.8775 },
        imageUrl: "https://picsum.photos/seed/peshawri/1200/800",
        openingHours: "12:30 - 14:45, 19:00 - 23:45"
      }
    ];
    await Restaurant.insertMany(indianRestaurants);
    console.log("Indian restaurants seeded!");
  }
};
