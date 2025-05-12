
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
  ingredients: string[];
}

interface MealCardProps {
  meal: Meal;
  mealTime: string;
}

export function MealCard({ meal, mealTime }: MealCardProps) {
  const [logged, setLogged] = useState(false);
  
  const handleLogMeal = () => {
    // In a real app, this would call an API to log the meal
    setLogged(true);
    toast({
      title: "Meal logged",
      description: `${meal.name} added to your food log`,
    });
  };
  
  return (
    <Card className="nutribot-card overflow-hidden">
      <div className="aspect-video relative bg-muted">
        {meal.imageUrl ? (
          <img 
            src={meal.imageUrl} 
            alt={meal.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
            No image available
          </div>
        )}
        <div className="absolute top-2 right-2 bg-background/90 text-sm font-medium px-2 py-1 rounded-md">
          {meal.calories} cal
        </div>
      </div>
      
      <CardHeader className="p-4 pb-0">
        <div className="text-sm text-muted-foreground font-medium uppercase">
          {mealTime}
        </div>
        <CardTitle className="text-lg">{meal.name}</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex justify-between text-sm mb-2">
          <div>
            <span className="font-medium">{meal.protein}g</span> Protein
          </div>
          <div>
            <span className="font-medium">{meal.carbs}g</span> Carbs
          </div>
          <div>
            <span className="font-medium">{meal.fat}g</span> Fat
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          {meal.ingredients.length > 0 && (
            <div>
              <p className="font-medium text-foreground mb-1">Ingredients:</p>
              <ul className="list-disc list-inside">
                {meal.ingredients.slice(0, 3).map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
                {meal.ingredients.length > 3 && (
                  <li>+{meal.ingredients.length - 3} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          variant={logged ? "outline" : "default"}
          onClick={handleLogMeal}
          disabled={logged}
        >
          {logged ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Logged
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" /> Log this meal
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
