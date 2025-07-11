import { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';

interface LocationDetectorProps {
  onLocationChange: (location: string) => void;
  currentLocation: string;
}

export function LocationDetector({ onLocationChange, currentLocation }: LocationDetectorProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualLocation, setManualLocation] = useState('');

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsDetecting(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // In a real app, you'd use a geocoding service here
          const locationName = `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          onLocationChange(locationName);
          setIsDetecting(false);
        } catch (err) {
          setError('Failed to get location name');
          setIsDetecting(false);
        }
      },
      (error) => {
        setError('Failed to get your location. Please enter manually.');
        setIsDetecting(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000
      }
    );
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualLocation.trim()) {
      onLocationChange(manualLocation.trim());
      setManualLocation('');
    }
  };

  return (
    <div className="dragon-card p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="text-primary" size={24} />
        <h2 className="text-xl font-semibold text-foreground">Your Location</h2>
      </div>

      {currentLocation ? (
        <div className="flex items-center gap-2 p-3 bg-dragon-primary-light rounded-lg mb-4">
          <MapPin className="text-primary" size={16} />
          <span className="text-sm text-foreground">{currentLocation}</span>
        </div>
      ) : (
        <p className="text-muted-foreground text-sm mb-4">
          Let Travel Buddy know where you are to get personalized recommendations!
        </p>
      )}

      <div className="space-y-4">
        <button
          onClick={detectLocation}
          disabled={isDetecting}
          className="w-full dragon-button-primary flex items-center justify-center gap-2"
        >
          <Navigation size={18} />
          {isDetecting ? 'Detecting...' : 'Use My Current Location'}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-card px-2 text-muted-foreground">or</span>
          </div>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-3">
          <input
            type="text"
            value={manualLocation}
            onChange={(e) => setManualLocation(e.target.value)}
            placeholder="Enter city, address, or landmark..."
            className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            className="w-full dragon-button-secondary"
          >
            Set Location
          </button>
        </form>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}