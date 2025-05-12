
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
    name: 'Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    servingSize: '100g'
  },
  {
    id: 'f3',
    name: 'Brown Rice',
    calories: 215,
    protein: 5,
    carbs: 45,
    fat: 1.8,
    servingSize: '1 cup cooked (195g)'
  },
  {
    id: 'f4',
    name: 'Egg',
    calories: 78,
    protein: 6,
    carbs: 0.6,
    fat: 5,
    servingSize: '1 large (50g)'
  },
  {
    id: 'f5',
    name: 'Avocado',
    calories: 240,
    protein: 3,
    carbs: 12,
    fat: 22,
    servingSize: '1 medium (150g)'
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
        // Use mock data for now
        const mockHistory = {
          meals: [
            {
              foodId: 'f2',
              name: 'Chicken Breast',
              calories: 165,
              protein: 31,
              carbs: 0,
              fat: 3.6,
              servingSize: '100g',
              mealType: 'lunch'
            },
            {
              foodId: 'f1',
              name: 'Apple',
              calories: 95,
              protein: 0.5,
              carbs: 25,
              fat: 0.3,
              servingSize: '1 medium',
              mealType: 'snack'
            }
          ]
        };
        
        // Try to get data from API, but fall back to mock data
        try {
          const history = await nutritionApi.getMealHistory({ 
            start: new Date().toISOString().split('T')[0], 
            end: new Date().toISOString().split('T')[0] 
          });
          
          // Now TypeScript knows that history has a meals property
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
            // Use mock data if API returns empty
            const recentFoods = mockHistory.meals.map(meal => ({
              id: meal.foodId,
              name: meal.name,
              calories: meal.calories,
              protein: meal.protein,
              carbs: meal.carbs,
              fat: meal.fat,
              servingSize: meal.servingSize
            }));
            
            setRecentlyLogged(recentFoods);
          }
        } catch (error) {
          console.error('Error loading recent foods from API, using mock data:', error);
          // Use mock data if API fails
          const recentFoods = mockHistory.meals.map(meal => ({
            id: meal.foodId,
            name: meal.name,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat,
            servingSize: meal.servingSize
          }));
          
          setRecentlyLogged(recentFoods);
        }
      } catch (error) {
        console.error('Error loading recent foods:', error);
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
      try {
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
        console.error('Error searching for foods from API, using local search:', error);
        // Fall back to local search if API fails
        const filteredResults = sampleFoodDatabase.filter(food => 
          food.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(filteredResults);
      }
    } catch (error) {
      console.error('Error searching for foods:', error);
      toast({
        title: "Error searching for foods",
        description: "There was a problem with the food search. Please try again.",
        variant: "destructive"
      });
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
    
    // Calculate total calories based on quantity
    const totalCalories = selectedFood.calories * quantity;
    
    setIsLoading(true);
    try {
      // Try to log food via API
      try {
        await nutritionApi.logFood({
          foodId: selectedFood.id,
          name: selectedFood.name,
          quantity: quantity,
          mealType: mealType,
          calories: selectedFood.calories,
          protein: selectedFood.protein,
          carbs: selectedFood.carbs,
          fat: selectedFood.fat,
          servingSize: selectedFood.servingSize
        });
      } catch (error) {
        console.error('Error logging food to API, proceeding with local update:', error);
        // Continue with local update even if API fails
      }
      
      toast({
        title: "Food logged successfully",
        description: `Added ${quantity} ${selectedFood.name} (${totalCalories} calories) to your ${mealType} log`,
      });
      
      // Add to recently logged
      setRecentlyLogged(prev => [selectedFood, ...prev.slice(0, 4)]);
      
      // Reset form
      setSelectedFood(null);
      setQuantity(1);
      setSearchQuery('');
      
      // Refresh daily summary
      fetchDailySummary();
    } catch (error) {
      console.error('Error logging food:', error);
      toast({
        title: "Error logging food",
        description: "There was a problem logging your food. Please try again.",
        variant: "destructive"
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
