
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useEffect, useState, useMemo } from 'react';

export function NutritionSummary() {
  const { dailySummary, loadingSummary } = useUser();
  const { macros } = dailySummary;
  const [isUpdating, setIsUpdating] = useState(false);

  const { total, carbsPercent, proteinPercent, fatPercent } = useMemo(() => {
    const t = (macros.carbs || 0) + (macros.protein || 0) + (macros.fat || 0);
    return {
      total: t,
      carbsPercent: t > 0 ? Math.round(((macros.carbs || 0) / t) * 100) : 0,
      proteinPercent: t > 0 ? Math.round(((macros.protein || 0) / t) * 100) : 0,
      fatPercent: t > 0 ? Math.round(((macros.fat || 0) / t) * 100) : 0,
    };
  }, [macros.carbs, macros.protein, macros.fat]);

  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 600);
    return () => clearTimeout(timer);
  }, [macros.carbs, macros.protein, macros.fat]);

  if (loadingSummary) {
    return (
      <div className="flex items-center justify-center h-[120px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-primary" />
        <span className="ml-2 text-muted-foreground">Loading macronutrient summary...</span>
      </div>
    );
  }

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
