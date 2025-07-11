import { DragonBuddy } from "../components/DragonBuddy";
import { LocationDetector } from "../components/LocationDetector";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Chat() {
  const [userLocation, setUserLocation] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Places
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Chat with Travel Buddy
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Location Detector */}
          <div className="lg:col-span-1">
            <LocationDetector 
              onLocationChange={setUserLocation}
              currentLocation={userLocation}
            />
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <DragonBuddy 
              userLocation={userLocation}
              onLocationRequest={() => {
                // This will trigger the location detector to show
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}