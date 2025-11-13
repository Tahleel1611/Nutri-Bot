
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useEffect, useState } from 'react';

export function CalorieProgress() {
  const { goals, dailySummary } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const percentConsumed = Math.min(
    (dailySummary.consumedCalories / goals.calorieTarget) * 100,
    100
  );
  
  // Flash animation when values change
  useEffect(() => {
    setIsUpdating(true);
    const timer = setTimeout(() => setIsUpdating(false), 600);
    return () => clearTimeout(timer);
  }, [dailySummary.consumedCalories]);
  
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
