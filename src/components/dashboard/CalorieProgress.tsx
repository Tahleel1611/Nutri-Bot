
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';

export function CalorieProgress() {
  const { goals, dailySummary } = useUser();
  
  const percentConsumed = Math.min(
    (dailySummary.consumedCalories / goals.calorieTarget) * 100,
    100
  );
  
  return (
    <Card className="nutribot-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Daily Calorie Progress</CardTitle>
        <CardDescription>
          {dailySummary.consumedCalories} / {goals.calorieTarget} calories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="nutribot-progress-bg">
            <div
              className="nutribot-progress-bar"
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
