
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Search, Plus, ArrowRight } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { nutritionApi, mealApi } from '@/utils/api';

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

// Sample food database for search and demo purposes
const sampleFoodDatabase: FoodItem[] = [
  // Fruits
  {
    id: 'f1',
    name: 'Apple',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    servingSize: '1 medium (182g)'
  },
  {
    id: 'f2',
    name: 'Banana',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4,
    servingSize: '1 medium (118g)'
  },
  {
    id: 'f3',
    name: 'Orange',
    calories: 62,
    protein: 1.2,
    carbs: 15,
    fat: 0.2,
    servingSize: '1 medium (131g)'
  },
  {
    id: 'f4',
    name: 'Strawberries',
    calories: 49,
    protein: 1,
    carbs: 12,
    fat: 0.5,
    servingSize: '1 cup (152g)'
  },
  {
    id: 'f5',
    name: 'Blueberries',
    calories: 84,
    protein: 1.1,
    carbs: 21,
    fat: 0.5,
    servingSize: '1 cup (148g)'
  },
  {
    id: 'f6',
    name: 'Avocado',
    calories: 240,
    protein: 3,
    carbs: 12,
    fat: 22,
    servingSize: '1 medium (150g)'
  },
  {
    id: 'f7',
    name: 'Grapes',
    calories: 104,
    protein: 1.1,
    carbs: 27,
    fat: 0.2,
    servingSize: '1 cup (151g)'
  },
  {
    id: 'f8',
    name: 'Watermelon',
    calories: 46,
    protein: 0.9,
    carbs: 11,
    fat: 0.2,
    servingSize: '1 cup diced (152g)'
  },
  
  // Proteins
  {
    id: 'f9',
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: '100g'
  },
  {
    id: 'f10',
    name: 'Salmon',
    calories: 206,
    protein: 22,
    carbs: 0,
    fat: 13,
    servingSize: '100g'
  },
  {
    id: 'f11',
    name: 'Ground Beef (90% lean)',
    calories: 176,
    protein: 20,
    carbs: 0,
    fat: 10,
    servingSize: '100g'
  },
  {
    id: 'f12',
    name: 'Egg',
    calories: 78,
    protein: 6,
    carbs: 0.6,
    fat: 5,
    servingSize: '1 large (50g)'
  },
  {
    id: 'f13',
    name: 'Tuna (canned in water)',
    calories: 116,
    protein: 26,
    carbs: 0,
    fat: 0.8,
    servingSize: '100g'
  },
  {
    id: 'f14',
    name: 'Tofu',
    calories: 76,
    protein: 8,
    carbs: 1.9,
    fat: 4.8,
    servingSize: '100g'
  },
  {
    id: 'f15',
    name: 'Greek Yogurt (plain)',
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    servingSize: '100g'
  },
  {
    id: 'f16',
    name: 'Turkey Breast',
    calories: 135,
    protein: 30,
    carbs: 0,
    fat: 0.7,
    servingSize: '100g'
  },
  {
    id: 'f17',
    name: 'Pork Chop',
    calories: 231,
    protein: 26,
    carbs: 0,
    fat: 14,
    servingSize: '100g'
  },
  
  // Grains & Carbs
  {
    id: 'f18',
    name: 'Brown Rice',
    calories: 215,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    servingSize: '1 cup cooked (195g)'
  },
  {
    id: 'f19',
    name: 'White Rice',
    calories: 205,
    protein: 4.2,
    carbs: 45,
    fat: 0.4,
    servingSize: '1 cup cooked (158g)'
  },
  {
    id: 'f20',
    name: 'Quinoa',
    calories: 222,
    protein: 8,
    carbs: 39,
    fat: 3.6,
    servingSize: '1 cup cooked (185g)'
  },
  {
    id: 'f21',
    name: 'Whole Wheat Bread',
    calories: 80,
    protein: 4,
    carbs: 14,
    fat: 1,
    servingSize: '1 slice (28g)'
  },
  {
    id: 'f22',
    name: 'Oatmeal',
    calories: 154,
    protein: 6,
    carbs: 27,
    fat: 3,
    servingSize: '1 cup cooked (234g)'
  },
  {
    id: 'f23',
    name: 'Pasta (cooked)',
    calories: 131,
    protein: 5,
    carbs: 25,
    fat: 1.1,
    servingSize: '1 cup (140g)'
  },
  {
    id: 'f24',
    name: 'Sweet Potato',
    calories: 112,
    protein: 2,
    carbs: 26,
    fat: 0.1,
    servingSize: '1 medium (130g)'
  },
  
  // Vegetables
  {
    id: 'f25',
    name: 'Broccoli',
    calories: 55,
    protein: 3.7,
    carbs: 11,
    fat: 0.6,
    servingSize: '1 cup chopped (156g)'
  },
  {
    id: 'f26',
    name: 'Spinach',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    servingSize: '1 cup raw (30g)'
  },
  {
    id: 'f27',
    name: 'Carrots',
    calories: 52,
    protein: 1.2,
    carbs: 12,
    fat: 0.3,
    servingSize: '1 cup chopped (128g)'
  },
  {
    id: 'f28',
    name: 'Bell Pepper',
    calories: 46,
    protein: 1.5,
    carbs: 9,
    fat: 0.4,
    servingSize: '1 cup chopped (149g)'
  },
  {
    id: 'f29',
    name: 'Tomato',
    calories: 32,
    protein: 1.6,
    carbs: 7,
    fat: 0.4,
    servingSize: '1 cup chopped (180g)'
  },
  {
    id: 'f30',
    name: 'Cucumber',
    calories: 16,
    protein: 0.7,
    carbs: 3.6,
    fat: 0.1,
    servingSize: '1 cup sliced (119g)'
  },
  {
    id: 'f31',
    name: 'Lettuce',
    calories: 5,
    protein: 0.5,
    carbs: 1,
    fat: 0.1,
    servingSize: '1 cup shredded (36g)'
  },
  
  // Nuts & Seeds
  {
    id: 'f32',
    name: 'Almonds',
    calories: 164,
    protein: 6,
    carbs: 6,
    fat: 14,
    servingSize: '1 oz (28g)'
  },
  {
    id: 'f33',
    name: 'Peanut Butter',
    calories: 188,
    protein: 8,
    carbs: 7,
    fat: 16,
    servingSize: '2 tbsp (32g)'
  },
  {
    id: 'f34',
    name: 'Walnuts',
    calories: 185,
    protein: 4.3,
    carbs: 3.9,
    fat: 18.5,
    servingSize: '1 oz (28g)'
  },
  {
    id: 'f35',
    name: 'Chia Seeds',
    calories: 138,
    protein: 4.7,
    carbs: 12,
    fat: 8.7,
    servingSize: '1 oz (28g)'
  },
  
  // Dairy
  {
    id: 'f36',
    name: 'Milk (2%)',
    calories: 122,
    protein: 8,
    carbs: 12,
    fat: 5,
    servingSize: '1 cup (244g)'
  },
  {
    id: 'f37',
    name: 'Cheddar Cheese',
    calories: 114,
    protein: 7,
    carbs: 0.4,
    fat: 9,
    servingSize: '1 oz (28g)'
  },
  {
    id: 'f38',
    name: 'Cottage Cheese (low-fat)',
    calories: 81,
    protein: 14,
    carbs: 3,
    fat: 1.2,
    servingSize: '1/2 cup (113g)'
  },
  
  // Beverages & Others
  {
    id: 'f39',
    name: 'Protein Shake',
    calories: 120,
    protein: 20,
    carbs: 3,
    fat: 2,
    servingSize: '1 scoop (30g)'
  },
  {
    id: 'f40',
    name: 'Olive Oil',
    calories: 119,
    protein: 0,
    carbs: 0,
    fat: 14,
    servingSize: '1 tbsp (14g)'
  },
  {
    id: 'f41',
    name: 'Honey',
    calories: 64,
    protein: 0.1,
    carbs: 17,
    fat: 0,
    servingSize: '1 tbsp (21g)'
  },
  {
    id: 'f42',
    name: 'Black Beans',
    calories: 227,
    protein: 15,
    carbs: 41,
    fat: 0.9,
    servingSize: '1 cup cooked (172g)'
  },
  {
    id: 'f43',
    name: 'Lentils',
    calories: 230,
    protein: 18,
    carbs: 40,
    fat: 0.8,
    servingSize: '1 cup cooked (198g)'
  },
  {
    id: 'f44',
    name: 'Chickpeas',
    calories: 269,
    protein: 14.5,
    carbs: 45,
    fat: 4.3,
    servingSize: '1 cup cooked (164g)'
  },
  {
    id: 'f45',
    name: 'Hummus',
    calories: 166,
    protein: 7.9,
    carbs: 14.3,
    fat: 9.6,
    servingSize: '1/4 cup (62g)'
  }
];

export default function CalorieLogger() {
  const { fetchDailySummary } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [mealType, setMealType] = useState('breakfast');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [recentlyLogged, setRecentlyLogged] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load recently logged foods on component mount
  useEffect(() => {
    async function loadRecentFoods() {
      try {
        setIsLoading(true);
        const history = await nutritionApi.getMealHistory({ 
          start: new Date().toISOString().split('T')[0], 
          end: new Date().toISOString().split('T')[0] 
        });
        
        if (history && history.meals && history.meals.length > 0) {
          const recentFoods = history.meals.map(meal => ({
            id: meal.foodId,
            name: meal.name,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
            servingSize: meal.servingSize
          }));
          
          setRecentlyLogged(recentFoods.slice(0, 5));
        } else {
          setRecentlyLogged([]);
        }
      } catch (error) {
        console.error('Error loading recent foods:', error);
        setRecentlyLogged([]);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadRecentFoods();
  }, []);
  
  const handleSearch = async () => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    
    setIsLoading(true);
    try {
      // Try to get food suggestions from API
      const results = await nutritionApi.getFoodSuggestions(searchQuery);
      if (results && results.length > 0) {
        setSearchResults(results);
      } else {
        // Fall back to local search if API returns empty results
        const filteredResults = sampleFoodDatabase.filter(food => 
          food.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredResults);
      }
    } catch (error) {
      console.error('Error searching for foods:', error);
      // Fall back to local search if API fails
      const filteredResults = sampleFoodDatabase.filter(food => 
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredResults);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setSearchResults([]);
  };
  
  const handleLogFood = async () => {
    if (!selectedFood) return;
    
    // Calculate total nutrients based on quantity
    const totalCalories = selectedFood.calories * quantity;
    const totalProtein = selectedFood.protein * quantity;
    const totalCarbs = selectedFood.carbs * quantity;
    const totalFat = selectedFood.fat * quantity;
    
    console.log('🍽️ Logging food:', {
      name: selectedFood.name,
      quantity,
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat
    });
    
    setIsLoading(true);
    try {
      const response = await nutritionApi.logFood({
        foodId: selectedFood.id,
        name: selectedFood.name,
        quantity: quantity,
        mealType: mealType,
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        servingSize: selectedFood.servingSize
      });
      
      console.log('✅ Food logged successfully:', response);
      
      // Refresh daily summary - force immediate update
      console.log('🔄 Refreshing daily summary...');
      await fetchDailySummary();
      console.log('✅ Daily summary refreshed - Dashboard should now show updated values!');
      
      toast({
        title: "✅ Food Logged Successfully!",
        description: `${quantity}x ${selectedFood.name} (${Math.round(totalCalories)} cal) added to your ${mealType}. Dashboard updated!`,
        duration: 4000,
      });
      
      // Add to recently logged
      setRecentlyLogged(prev => [selectedFood, ...prev.slice(0, 4)]);
      
      // Reset form
      setSelectedFood(null);
      setQuantity(1);
      setSearchQuery('');
    } catch (error) {
      console.error('❌ Error logging food:', error);
      toast({
        title: "❌ Error logging food",
        description: "There was a problem logging your food. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleManualEntry = () => {
    toast({
      title: "Manual entry feature",
      description: "This feature would allow you to enter custom food items with nutritional information",
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Log Your Food
        </h1>
        <p className="text-muted-foreground">
          Track your daily food intake to meet your nutrition goals
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="nutribot-card">
            <CardHeader>
              <CardTitle>Add Food Item</CardTitle>
              <CardDescription>
                Search for a food item or add it manually
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {selectedFood ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="bg-secondary p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{selectedFood.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedFood.servingSize}
                        </p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedFood(null)}
                      >
                        Change
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Calories</p>
                        <p className="font-medium">{selectedFood.calories * quantity}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Protein</p>
                        <p className="font-medium">{selectedFood.protein * quantity}g</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Carbs</p>
                        <p className="font-medium">{selectedFood.carbs * quantity}g</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Fat</p>
                        <p className="font-medium">{selectedFood.fat * quantity}g</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="0.25"
                        step="0.25"
                        value={quantity}
                        onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="mealType">Meal</Label>
                      <Select
                        value={mealType}
                        onValueChange={setMealType}
                      >
                        <SelectTrigger id="mealType">
                          <SelectValue placeholder="Select meal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snacks">Snacks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Search for a food (e.g., apple, chicken breast)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>
                    <Button onClick={handleSearch}>
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  
                  {searchResults.length > 0 && (
                    <div className="border rounded-md divide-y">
                      {searchResults.map((food) => (
                        <div
                          key={food.id}
                          className="p-3 hover:bg-secondary cursor-pointer flex justify-between items-center"
                          onClick={() => handleSelectFood(food)}
                        >
                          <div>
                            <p className="font-medium">{food.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {food.servingSize}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <span className="mr-2">{food.calories} cal</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <div className="flex-grow border-t border-muted"></div>
                    <div className="mx-4 text-muted-foreground text-sm">or</div>
                    <div className="flex-grow border-t border-muted"></div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleManualEntry}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add custom food
                  </Button>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={!selectedFood}
                onClick={handleLogFood}
              >
                Log Food
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="nutribot-card">
            <CardHeader>
              <CardTitle>Recently Logged</CardTitle>
            </CardHeader>
            <CardContent>
              {recentlyLogged.length > 0 ? (
                <div className="space-y-2">
                  {recentlyLogged.map((food, index) => (
                    <div 
                      key={`${food.id}-${index}`}
                      className="flex justify-between p-2 hover:bg-secondary rounded cursor-pointer"
                      onClick={() => handleSelectFood(food)}
                    >
                      <div>
                        <p className="font-medium">{food.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {food.servingSize}
                        </p>
                      </div>
                      <p>{food.calories} cal</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No foods logged yet</p>
                  <p className="text-sm">Your recent items will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
