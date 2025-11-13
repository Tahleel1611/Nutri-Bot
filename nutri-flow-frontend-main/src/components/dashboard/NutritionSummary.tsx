
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';

export function NutritionSummary() {
  const { dailySummary } = useUser();
  const { macros } = dailySummary;
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Calculate percentages for pie chart visualization
  const total = macros.carbs + macros.protein + macros.fat;
  const carbsPercent = total > 0 ? Math.round((macros.carbs / total) * 100) : 0;
  const proteinPercent = total > 0 ? Math.round((macros.protein / total) * 100) : 0;
  const fatPercent = total > 0 ? Math.round((macros.fat / total) * 100) : 0;
  
  // Flash animation when macros change
  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 600);
    return () => clearTimeout(timer);
  }, [macros.carbs, macros.protein, macros.fat]);
  
  return (
    <Card className={`nutribot-card transition-all duration-300 ${isUpdating ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Macronutrient Distribution</CardTitle>
        <CardDescription>Today's nutritional breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple circular visualization */}
          <div className="flex justify-center py-2">
            <div className={`h-24 w-24 rounded-full flex items-center justify-center transition-all duration-500 ${isUpdating ? 'scale-110' : 'scale-100'}`} 
                 style={{ 
                   background: `conic-gradient(
                     hsl(var(--primary)) 0% ${carbsPercent}%, 
                     hsl(var(--accent)) ${carbsPercent}% ${carbsPercent + proteinPercent}%, 
                     hsl(var(--secondary)) ${carbsPercent + proteinPercent}% 100%
                   )` 
                 }}>
              <div className="h-16 w-16 rounded-full bg-card flex items-center justify-center text-sm font-medium">
                {total} g
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <div className="space-y-1">
              <div className="flex justify-center">
                <div className="h-3 w-3 rounded-full bg-primary" />
              </div>
              <div>Carbs</div>
              <div className={`font-medium transition-all duration-300 ${isUpdating ? 'text-primary font-bold scale-110' : ''}`}>
                {macros.carbs}g
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-center">
                <div className="h-3 w-3 rounded-full bg-accent" />
              </div>
              <div>Protein</div>
              <div className={`font-medium transition-all duration-300 ${isUpdating ? 'text-primary font-bold scale-110' : ''}`}>
                {macros.protein}g
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-center">
                <div className="h-3 w-3 rounded-full bg-secondary" />
              </div>
              <div>Fat</div>
              <div className={`font-medium transition-all duration-300 ${isUpdating ? 'text-primary font-bold scale-110' : ''}`}>
                {macros.fat}g
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
