import { useState } from 'react';
import { LocationDetector } from '@/components/LocationDetector';
import { PlaceCategories } from '@/components/PlaceCategories';
import { PlacesList } from '@/components/PlacesList';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { Link } from 'wouter';
import travelBuddyKoala from '@/assets/travel-buddy-icon.png';

const Index = () => {
  const [userLocation, setUserLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleLocationChange = (location: string) => {
    setUserLocation(location);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img 
                src={travelBuddyKoala} 
                alt="Travel Buddy"
                className="w-10 h-10 animate-buddy-float"
              />
              <div>
                <h1 className="text-2xl font-bold text-gradient-buddy">Travel Buddy</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Location Discovery</p>
              </div>
            </div>
            <Link href="/chat">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <MessageCircle className="w-4 h-4 mr-2" />
                Chat with Travel Buddy
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          {!userLocation && (
            <div className="text-center py-12">
              <div className="mb-8">
                <img 
                  src={travelBuddyKoala} 
                  alt="Travel Buddy" 
                  className="w-24 h-24 mx-auto animate-buddy-bounce mb-4"
                />
                <h2 className="text-3xl font-bold text-foreground mb-2">
                  Welcome to Travel Buddy! ✈️🐨
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Your AI-powered companion for discovering amazing hotels, restaurants, and landmarks wherever you are.
                  Let's start by finding your location!
                </p>
              </div>
            </div>
          )}

          {/* Location Detector */}
          <LocationDetector 
            onLocationChange={handleLocationChange}
            currentLocation={userLocation}
          />

          {/* Categories (only show if location is set) */}
          {userLocation && (
            <PlaceCategories 
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
            />
          )}

          {/* Places List (only show if both location and category are selected) */}
          {userLocation && selectedCategory && (
            <PlacesList 
              category={selectedCategory}
              location={userLocation}
            />
          )}
        </div>
      </main>

      {/* Floating Chat Button */}
      <Link href="/chat">
        <Button 
          size="lg"
          className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full w-16 h-16 p-0 z-50"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  );
};

export default Index;
