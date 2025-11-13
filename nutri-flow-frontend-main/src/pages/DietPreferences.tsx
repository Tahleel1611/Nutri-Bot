
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/components/ui/use-toast';

const dietTypes = [
  { value: 'balanced', label: 'Balanced', description: 'Includes all food groups in moderate amounts' },
  { value: 'keto', label: 'Keto', description: 'High fat, very low carb for ketosis' },
  { value: 'paleo', label: 'Paleo', description: 'Based on foods similar to what hunter-gatherers ate' },
  { value: 'mediterranean', label: 'Mediterranean', description: 'Heart-healthy diet rich in olive oil, seafood' },
  { value: 'vegan', label: 'Vegan', description: 'Excludes all animal products' }
];

const healthGoals = [
  { value: 'lose', label: 'Lose Weight', description: 'Calorie deficit to reduce body weight' },
  { value: 'maintain', label: 'Maintain Weight', description: 'Balance calories to maintain current weight' },
  { value: 'gain', label: 'Gain Weight', description: 'Calorie surplus to increase body weight' }
];

const deficiencies = [
  { id: 'iron', label: 'Iron' },
  { id: 'calcium', label: 'Calcium' },
  { id: 'vitamin-d', label: 'Vitamin D' },
  { id: 'vitamin-b12', label: 'Vitamin B12' },
  { id: 'omega3', label: 'Omega-3' },
  { id: 'protein', label: 'Protein' },
  { id: 'fiber', label: 'Fiber' },
  { id: 'zinc', label: 'Zinc' }
];

export default function DietPreferences() {
  const { goals, updateGoals } = useUser();
  
  const [selectedDiet, setSelectedDiet] = useState(goals.dietType);
  const [selectedGoal, setSelectedGoal] = useState(goals.healthGoal);
  const [calorieTarget, setCalorieTarget] = useState(goals.calorieTarget);
  const [selectedDeficiencies, setSelectedDeficiencies] = useState<string[]>(goals.deficiencies);
  
  const handleCalorieChange = (value: number[]) => {
    setCalorieTarget(value[0]);
  };
  
  const handleDeficiencyChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedDeficiencies([...selectedDeficiencies, id]);
    } else {
      setSelectedDeficiencies(selectedDeficiencies.filter(item => item !== id));
    }
  };
  
  const handleSave = () => {
    updateGoals({
      dietType: selectedDiet,
      healthGoal: selectedGoal,
      calorieTarget,
      deficiencies: selectedDeficiencies
    });
    
    toast({
      title: "Preferences saved",
      description: "Your diet preferences have been updated",
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Diet Preferences
        </h1>
        <p className="text-muted-foreground">
          Choose your diet type, health goal, and nutritional focus
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="nutribot-card">
          <CardHeader>
            <CardTitle>Diet Type</CardTitle>
            <CardDescription>
              Select the type of diet you want to follow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedDiet} 
              onValueChange={setSelectedDiet}
              className="space-y-3"
            >
              {dietTypes.map(diet => (
                <div 
                  key={diet.value}
                  className="flex items-start space-x-2 border p-3 rounded-lg hover:bg-secondary"
                >
                  <RadioGroupItem value={diet.value} id={diet.value} />
                  <div className="grid gap-1 leading-none">
                    <Label
                      htmlFor={diet.value}
                      className="font-medium cursor-pointer"
                    >
                      {diet.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {diet.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        
        <Card className="nutribot-card">
          <CardHeader>
            <CardTitle>Health Goal</CardTitle>
            <CardDescription>
              Set your primary health objective
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={selectedGoal} 
              onValueChange={setSelectedGoal}
              className="space-y-3"
            >
              {healthGoals.map(goal => (
                <div 
                  key={goal.value}
                  className="flex items-start space-x-2 border p-3 rounded-lg hover:bg-secondary"
                >
                  <RadioGroupItem value={goal.value} id={goal.value} />
                  <div className="grid gap-1 leading-none">
                    <Label
                      htmlFor={goal.value}
                      className="font-medium cursor-pointer"
                    >
                      {goal.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {goal.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
        
        <Card className="nutribot-card">
          <CardHeader>
            <CardTitle>Calorie Target</CardTitle>
            <CardDescription>
              Set your daily calorie goal
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Slider
              value={[calorieTarget]}
              min={1200}
              max={4000}
              step={50}
              onValueChange={handleCalorieChange}
              className="py-4"
            />
            <div className="flex justify-between text-sm font-medium mt-2">
              <span>1200</span>
              <span className="text-center text-primary text-lg">
                {calorieTarget} calories
              </span>
              <span>4000</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Weight loss</span>
              <span>Weight gain</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="nutribot-card">
          <CardHeader>
            <CardTitle>Nutritional Focus</CardTitle>
            <CardDescription>
              Select any specific nutrients you want to focus on
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {deficiencies.map(item => (
                <div 
                  key={item.id}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-secondary"
                >
                  <Checkbox 
                    id={item.id} 
                    checked={selectedDeficiencies.includes(item.id)}
                    onCheckedChange={(checked) => 
                      handleDeficiencyChange(item.id, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={item.id}
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    {item.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center">
        <Button size="lg" onClick={handleSave}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
