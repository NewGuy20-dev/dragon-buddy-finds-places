import { Building2, UtensilsCrossed, Landmark } from 'lucide-react';

interface PlaceCategoriesProps {
  onCategorySelect: (category: string) => void;
  selectedCategory: string | null;
}

export function PlaceCategories({ onCategorySelect, selectedCategory }: PlaceCategoriesProps) {
  const categories = [
    {
      id: 'hotels',
      name: 'Hotels',
      icon: Building2,
      description: 'Find comfortable accommodations',
      color: 'bg-dragon-primary-light border-primary'
    },
    {
      id: 'restaurants',
      name: 'Restaurants',
      icon: UtensilsCrossed,
      description: 'Discover delicious dining',
      color: 'bg-dragon-secondary-light border-secondary'
    },
    {
      id: 'landmarks',
      name: 'Landmarks',
      icon: Landmark,
      description: 'Explore cultural attractions',
      color: 'bg-accent border-accent-foreground'
    }
  ];

  return (
    <div className="dragon-card p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">What are you looking for?</h2>
        <p className="text-muted-foreground text-sm">
          Choose a category to get personalized recommendations from Dragon Buddy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`
                p-4 rounded-xl border-2 transition-all duration-300
                ${isSelected 
                  ? `${category.color} border-opacity-100 scale-105` 
                  : 'bg-card border-border hover:border-primary/30'
                }
              `}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`
                  p-3 rounded-full transition-colors
                  ${isSelected 
                    ? 'bg-white/50' 
                    : 'bg-muted'
                  }
                `}>
                  <Icon 
                    size={24} 
                    className={isSelected ? 'text-primary' : 'text-muted-foreground'} 
                  />
                </div>
                
                <div>
                  <h3 className={`
                    font-semibold transition-colors
                    ${isSelected ? 'text-foreground' : 'text-foreground'}
                  `}>
                    {category.name}
                  </h3>
                  <p className={`
                    text-sm transition-colors
                    ${isSelected ? 'text-foreground/80' : 'text-muted-foreground'}
                  `}>
                    {category.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}