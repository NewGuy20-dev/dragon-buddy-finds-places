import { useState } from 'react';
import { Search, Filter, Sparkles } from 'lucide-react';
import { PlaceCard } from './PlaceCard';

interface Place {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance: string;
  price: string;
  image: string;
  description: string;
  openNow: boolean;
}

interface PlacesListProps {
  category: string;
  location: string;
}

export function PlacesList({ category, location }: PlacesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // Mock data - in real app, this would come from API
  const mockPlaces: Place[] = [
    {
      id: '1',
      name: 'Grand Plaza Hotel',
      category: 'hotels',
      rating: 4.5,
      distance: '0.3 km',
      price: '$120/night',
      image: '',
      description: 'Luxury hotel in the heart of the city with spa and rooftop restaurant',
      openNow: true
    },
    {
      id: '2',
      name: 'The Local Bistro',
      category: 'restaurants',
      rating: 4.8,
      distance: '0.1 km',
      price: '$$',
      image: '',
      description: 'Farm-to-table restaurant serving fresh, locally sourced cuisine',
      openNow: true
    },
    {
      id: '3',
      name: 'Historic Town Square',
      category: 'landmarks',
      rating: 4.6,
      distance: '0.5 km',
      price: 'Free',
      image: '',
      description: 'Beautiful 18th-century town square with historic architecture',
      openNow: true
    },
    {
      id: '4',
      name: 'Cozy Corner Inn',
      category: 'hotels',
      rating: 4.2,
      distance: '0.8 km',
      price: '$85/night',
      image: '',
      description: 'Charming boutique hotel with personalized service',
      openNow: true
    },
    {
      id: '5',
      name: 'Dragon Noodle House',
      category: 'restaurants',
      rating: 4.7,
      distance: '0.4 km',
      price: '$',
      image: '',
      description: 'Authentic Asian cuisine with handmade noodles and dumplings',
      openNow: false
    }
  ].filter(place => place.category === category);

  const filteredPlaces = mockPlaces.filter(place =>
    place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryTitle = () => {
    switch (category) {
      case 'hotels': return 'Hotels & Accommodations';
      case 'restaurants': return 'Restaurants & Dining';
      case 'landmarks': return 'Landmarks & Attractions';
      default: return 'Places';
    }
  };

  const handlePlaceClick = (place: Place) => {
    setSelectedPlace(place);
    // In a real app, this would navigate to a detailed view
    console.log('Selected place:', place);
  };

  return (
    <div className="dragon-card p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="text-primary" size={24} />
        <div>
          <h2 className="text-xl font-semibold text-foreground">{getCategoryTitle()}</h2>
          <p className="text-sm text-muted-foreground">Near {location}</p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${category}...`}
            className="w-full pl-10 pr-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button className="dragon-button-secondary px-4 py-3">
          <Filter size={18} />
        </button>
      </div>

      {/* Results */}
      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onClick={handlePlaceClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-muted-foreground" size={24} />
          </div>
          <h3 className="font-semibold text-foreground mb-2">No places found</h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your search or ask Dragon Buddy for help!
          </p>
        </div>
      )}

      {/* AI Suggestion */}
      <div className="mt-6 p-4 bg-dragon-primary-light rounded-lg border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-primary" size={18} />
          <span className="font-medium text-foreground">Dragon Buddy's Tip</span>
        </div>
        <p className="text-sm text-foreground/80">
          {category === 'hotels' && "Looking for something specific? Try asking me about 'pet-friendly hotels' or 'hotels with pools'!"}
          {category === 'restaurants' && "Want personalized recommendations? Tell me your dietary preferences or favorite cuisine type!"}
          {category === 'landmarks' && "Interested in history? Ask me about the stories behind these landmarks!"}
        </p>
      </div>
    </div>
  );
}