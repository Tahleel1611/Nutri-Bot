
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { useEffect } from 'react';
import { CalorieProgress } from '@/components/dashboard/CalorieProgress';
import { NutritionSummary } from '@/components/dashboard/NutritionSummary';
import { DietModeCard } from '@/components/dashboard/DietModeCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const { fetchDailySummary, loading } = useUser();
  
  useEffect(() => {
    if (user) {
      fetchDailySummary();
    }
  }, [user, fetchDailySummary]);
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome to NutriBot
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your personalized nutrition assistant. Sign in to track your calories, get meal recommendations, and achieve your health goals.
        </p>
        <div className="flex gap-4">
          <Button asChild>
            <Link to="/login">Sign In</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/signup">Create Account</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <Button asChild>
          <Link to="/calorie-logger">
            Log Food
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <CalorieProgress />
        <NutritionSummary />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <DietModeCard />
        <QuickActions />
      </div>
    </div>
  );
}
