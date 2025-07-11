import { useState } from 'react';
import { Search, Filter, Sparkles, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { PlaceCard } from './PlaceCard';

interface Place {
  name: string;
  category: string;
  rating: number;
  distance: string;
  price: string;
  description: string;
  openNow: boolean;
  address: string;
  phone?: string;
  website?: string;
  imageUrl?: string;
}

interface PlacesListProps {
  category: string;
  location: string;
}

export function PlacesList({ category, location }: PlacesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const { data: places, isLoading, error } = useQuery({
    queryKey: ['/api/places', location, category, searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams({
        location,
        category,
        ...(searchQuery && { query: searchQuery })
      });
      const response = await fetch(`/api/places?${params}`);
      if (!response.ok) throw new Error('Failed to fetch places');
      return response.json() as Place[];
    },
    enabled: !!(location && category),
  });

  const filteredPlaces = places?.filter(place =>
    place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    place.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

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
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="dragon-card p-4 animate-pulse">
              <div className="h-32 bg-muted rounded-lg mb-4"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-red-500" size={24} />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Error loading places</h3>
          <p className="text-muted-foreground text-sm">
            There was an issue fetching places. Please try again.
          </p>
        </div>
      ) : filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlaces.map((place, index) => (
            <PlaceCard
              key={`${place.name}-${index}`}
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
            Try adjusting your search or ask Travel Buddy for help!
          </p>
        </div>
      )}

      {/* Click to open in Maps hint */}
      {filteredPlaces.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
            <MapPin size={16} />
            <span>Click any place card to open it in Google Maps</span>
          </div>
        </div>
      )}

      {/* AI Suggestion */}
      <div className="mt-6 p-4 bg-dragon-primary-light rounded-lg border border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="text-primary" size={18} />
          <span className="font-medium text-foreground">Travel Buddy's Tip</span>
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