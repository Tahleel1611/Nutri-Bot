
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { Heart } from 'lucide-react';

export function DietModeCard() {
  const { goals } = useUser();
  
  // Helper function to get a descriptive text based on diet type
  const getDietDescription = (dietType: string, healthGoal: string) => {
    let description = '';
    
    switch (dietType) {
      case 'keto':
        description = 'High fat, low carb diet for ketosis';
        break;
      case 'vegan':
        description = 'Plant-based diet without animal products';
        break;
      case 'paleo':
        description = 'Foods similar to what hunter-gatherers ate';
        break;
      case 'mediterranean':
        description = 'Heart-healthy diet with olive oil and seafood';
        break;
      default:
        description = 'Balanced nutrition with all food groups';
    }
    
    return `${description}. Focus on ${healthGoal === 'lose' 
      ? 'weight loss' 
      : healthGoal === 'gain' 
        ? 'weight gain' 
        : 'weight maintenance'}.`;
  };
  
  return (
    <Card className="nutribot-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg capitalize">
            {goals.dietType} Diet
          </CardTitle>
          <Heart className="h-5 w-5 text-primary" />
        </div>
        <CardDescription>
          Your current diet mode
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {getDietDescription(goals.dietType, goals.healthGoal)}
        </p>
        
        {goals.deficiencies.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium mb-1">Addressing deficiencies:</p>
            <div className="flex flex-wrap gap-1">
              {goals.deficiencies.map((deficiency) => (
                <span key={deficiency} className="nutribot-badge bg-primary/10 text-primary">
                  {deficiency}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
