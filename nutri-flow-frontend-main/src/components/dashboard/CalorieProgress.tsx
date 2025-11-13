
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useEffect, useState, useMemo } from 'react';

export function CalorieProgress() {
  const { goals, dailySummary, loadingSummary } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);

  const percentConsumed = useMemo(() => {
    const target = goals.calorieTarget || 0;
    if (!target) return 0;
    return Math.min((dailySummary.consumedCalories / target) * 100, 100);
  }, [dailySummary.consumedCalories, goals.calorieTarget]);

  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 600);
    return () => clearTimeout(timer);
  }, [dailySummary.consumedCalories]);

  if (loadingSummary) {
    return (
      <div className="flex items-center justify-center h-[120px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-primary" />
        <span className="ml-2 text-muted-foreground">Loading calorie progress...</span>
      </div>
    );
  }

  return (
    <Card className={`nutribot-card transition-all duration-300 ${isUpdating ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Daily Calorie Progress</CardTitle>
        <CardDescription>
          <span className={isUpdating ? 'font-bold text-primary' : ''}>
            {dailySummary.consumedCalories}
          </span> / {goals.calorieTarget} calories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="nutribot-progress-bg">
            <div
              className="nutribot-progress-bar transition-all duration-500 ease-out"
              style={{ width: `${percentConsumed}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{dailySummary.remainingCalories} remaining</span>
            <span>{Math.round(percentConsumed)}% consumed</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
