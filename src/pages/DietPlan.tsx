
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MealCard, Meal } from '@/components/dietplan/MealCard';
import { useUser } from '@/contexts/UserContext';
import { RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

export default function DietPlan() {
  const { goals, profile } = useUser();
  const [loading, setLoading] = useState(false);
  const [mealPlan, setMealPlan] = useState<Record<string, Meal[]>>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  });
  
  // Mock meal plan generation - in a real app, this would be an API call
  const generateMealPlan = async () => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response data
      const mockMealPlan: Record<string, Meal[]> = {
        breakfast: [
          {
            id: 'b1',
            name: 'Greek Yogurt Bowl',
            calories: 320,
            protein: 22,
            carbs: 40,
            fat: 8,
            imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            ingredients: ['Greek yogurt', 'Honey', 'Mixed berries', 'Granola']
          }
        ],
        lunch: [
          {
            id: 'l1',
            name: 'Grilled Chicken Salad',
            calories: 420,
            protein: 35,
            carbs: 15,
            fat: 22,
            imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            ingredients: ['Grilled chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Avocado', 'Olive oil dressing']
          }
        ],
        dinner: [
          {
            id: 'd1',
            name: 'Baked Salmon with Quinoa',
            calories: 480,
            protein: 38,
            carbs: 35,
            fat: 20,
            imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            ingredients: ['Salmon fillet', 'Quinoa', 'Broccoli', 'Lemon', 'Dill']
          }
        ],
        snacks: [
          {
            id: 's1',
            name: 'Apple with Almond Butter',
            calories: 180,
            protein: 5,
            carbs: 25,
            fat: 9,
            ingredients: ['Apple', 'Almond butter']
          }
        ]
      };
      
      setMealPlan(mockMealPlan);
      toast({
        title: "Meal plan generated",
        description: `Personalized for your ${goals.dietType} diet and ${goals.healthGoal} goal`,
      });
    } catch (error) {
      toast({
        title: "Failed to generate meal plan",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    generateMealPlan();
  }, []);
  
  const totalCalories = Object.values(mealPlan).flat().reduce(
    (sum, meal) => sum + meal.calories, 0
  );
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Your Diet Plan
          </h1>
          <p className="text-muted-foreground">
            Personalized recommendations based on your preferences
          </p>
        </div>
        
        <Button onClick={generateMealPlan} disabled={loading}>
          {loading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Plan
            </>
          )}
        </Button>
      </div>
      
      <div className="flex items-center justify-between bg-primary/10 text-primary rounded-lg p-4">
        <div>
          <p className="font-medium">Daily calories: {totalCalories}</p>
          <p className="text-sm">Target: {goals.calorieTarget} calories</p>
        </div>
        <div className="text-sm">
          <p className="capitalize">{goals.dietType} Diet</p>
          <p className="capitalize">Goal: {goals.healthGoal} weight</p>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="breakfast">Breakfast</TabsTrigger>
          <TabsTrigger value="lunch">Lunch</TabsTrigger>
          <TabsTrigger value="dinner">Dinner</TabsTrigger>
          <TabsTrigger value="snacks">Snacks</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {Object.entries(mealPlan).map(([mealTime, meals]) => (
            <div key={mealTime}>
              <h2 className="text-xl font-semibold capitalize mb-3">{mealTime}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {meals.map(meal => (
                  <MealCard key={meal.id} meal={meal} mealTime={mealTime} />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
        
        {Object.entries(mealPlan).map(([mealTime, meals]) => (
          <TabsContent key={mealTime} value={mealTime} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {meals.map(meal => (
                <MealCard key={meal.id} meal={meal} mealTime={mealTime} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
