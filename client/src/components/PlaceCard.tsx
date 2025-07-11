import { Star, MapPin, Clock, DollarSign } from 'lucide-react';

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
}

interface PlaceCardProps {
  place: Place;
  onClick: (place: Place) => void;
}

export function PlaceCard({ place, onClick }: PlaceCardProps) {
  return (
    <div 
      className="dragon-card p-0 overflow-hidden cursor-pointer group"
      onClick={() => onClick(place)}
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-dragon-primary-light to-dragon-secondary-light">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-2 mx-auto">
              {place.category === 'hotels' && <span className="text-2xl">🏨</span>}
              {place.category === 'restaurants' && <span className="text-2xl">🍽️</span>}
              {place.category === 'landmarks' && <span className="text-2xl">🏛️</span>}
            </div>
            <p className="text-xs text-muted-foreground">Photo coming soon</p>
          </div>
        </div>
        
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${place.openNow 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted text-muted-foreground'
            }
          `}>
            {place.openNow ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {place.name}
          </h3>
          <div className="flex items-center gap-1 ml-2">
            <Star className="text-yellow-500 fill-current" size={16} />
            <span className="text-sm font-medium">{place.rating}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {place.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin size={14} />
              <span>{place.distance}</span>
            </div>
            
            {place.category !== 'landmarks' && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <DollarSign size={14} />
                <span>{place.price}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock size={14} />
            <span>{place.openNow ? 'Open now' : 'Closed'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}