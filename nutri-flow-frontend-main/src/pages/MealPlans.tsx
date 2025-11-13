import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { ChevronRight, Calendar, Clock, Plus, Check } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { planApi } from '@/utils/api';

// Sample meal plans
const sampleMealPlans = [
  {
    id: 'plan1',
    name: 'Weight Loss Plan',
    description: 'A calorie-controlled plan designed for steady weight loss',
    duration: '4 weeks',
    calorieTarget: 1800,
    dietType: 'Low-carb',
    tags: ['Weight Loss', 'Low-carb', 'High-protein'],
    meals: [
      {
        day: 'Monday',
        items: [
          { type: 'breakfast', name: 'Greek yogurt with berries and nuts', calories: 320 },
          { type: 'lunch', name: 'Grilled chicken salad with olive oil dressing', calories: 450 },
          { type: 'dinner', name: 'Baked salmon with roasted vegetables', calories: 520 },
          { type: 'snack', name: 'Apple with almond butter', calories: 200 }
        ]
      },
      {
        day: 'Tuesday',
        items: [
          { type: 'breakfast', name: 'Vegetable omelette with whole grain toast', calories: 350 },
          { type: 'lunch', name: 'Turkey and avocado wrap', calories: 420 },
          { type: 'dinner', name: 'Lentil soup with side salad', calories: 480 },
          { type: 'snack', name: 'Protein smoothie', calories: 220 }
        ]
      },
      {
        day: 'Wednesday',
        items: [
          { type: 'breakfast', name: 'Overnight oats with chia seeds', calories: 340 },
          { type: 'lunch', name: 'Quinoa bowl with grilled vegetables', calories: 410 },
          { type: 'dinner', name: 'Baked cod with steamed broccoli', calories: 490 },
          { type: 'snack', name: 'Carrot sticks with hummus', calories: 180 }
        ]
      }
    ]
  },
  {
    id: 'plan2',
    name: 'Muscle Building Plan',
    description: 'High-protein plan to support muscle growth and recovery',
    duration: '6 weeks',
    calorieTarget: 2800,
    dietType: 'High-protein',
    tags: ['Muscle Gain', 'High-protein', 'Strength'],
    meals: [
      {
        day: 'Monday',
        items: [
          { type: 'breakfast', name: 'Protein pancakes with banana and honey', calories: 520 },
          { type: 'lunch', name: 'Chicken breast with brown rice and vegetables', calories: 650 },
          { type: 'dinner', name: 'Steak with sweet potato and asparagus', calories: 720 },
          { type: 'snack', name: 'Protein shake with peanut butter', calories: 350 }
        ]
      },
      {
        day: 'Tuesday',
        items: [
          { type: 'breakfast', name: 'Egg white omelette with spinach and cheese', calories: 480 },
          { type: 'lunch', name: 'Turkey and quinoa bowl with avocado', calories: 620 },
          { type: 'dinner', name: 'Salmon with wild rice and roasted vegetables', calories: 680 },
          { type: 'snack', name: 'Greek yogurt with nuts and berries', calories: 320 }
        ]
      },
      {
        day: 'Wednesday',
        items: [
          { type: 'breakfast', name: 'Protein smoothie bowl with granola', calories: 510 },
          { type: 'lunch', name: 'Tuna salad sandwich on whole grain bread', calories: 580 },
          { type: 'dinner', name: 'Grilled chicken with pasta and vegetables', calories: 710 },
          { type: 'snack', name: 'Cottage cheese with pineapple', calories: 280 }
        ]
      }
    ]
  },
  {
    id: 'plan3',
    name: 'Balanced Nutrition Plan',
    description: 'Well-rounded plan for overall health and maintenance',
    duration: 'Ongoing',
    calorieTarget: 2200,
    dietType: 'Balanced',
    tags: ['Maintenance', 'Balanced', 'Whole Foods'],
    meals: [
      {
        day: 'Monday',
        items: [
          { type: 'breakfast', name: 'Whole grain toast with avocado and eggs', calories: 420 },
          { type: 'lunch', name: 'Mediterranean bowl with falafel', calories: 550 },
          { type: 'dinner', name: 'Grilled fish with quinoa and vegetables', calories: 580 },
          { type: 'snack', name: 'Mixed nuts and dried fruit', calories: 250 }
        ]
      },
      {
        day: 'Tuesday',
        items: [
          { type: 'breakfast', name: 'Smoothie with spinach, banana, and protein', calories: 380 },
          { type: 'lunch', name: 'Chicken and vegetable soup with whole grain roll', calories: 520 },
          { type: 'dinner', name: 'Tofu stir-fry with brown rice', calories: 560 },
          { type: 'snack', name: 'Apple with cheese', calories: 220 }
        ]
      },
      {
        day: 'Wednesday',
        items: [
          { type: 'breakfast', name: 'Oatmeal with berries and walnuts', calories: 410 },
          { type: 'lunch', name: 'Turkey and avocado sandwich', calories: 540 },
          { type: 'dinner', name: 'Baked chicken with roasted vegetables', calories: 590 },
          { type: 'snack', name: 'Yogurt parfait', calories: 240 }
        ]
      }
    ]
  },
  {
    id: 'plan4',
    name: 'Vegetarian Plan',
    description: 'Plant-based nutrition plan rich in vegetables, legumes, and whole grains',
    duration: '4 weeks',
    calorieTarget: 2000,
    dietType: 'Vegetarian',
    tags: ['Vegetarian', 'Plant-based', 'Sustainable'],
    meals: [
      {
        day: 'Monday',
        items: [
          { type: 'breakfast', name: 'Spinach and mushroom omelette', calories: 350 },
          { type: 'lunch', name: 'Lentil soup with whole grain bread', calories: 480 },
          { type: 'dinner', name: 'Vegetable stir-fry with tofu', calories: 520 },
          { type: 'snack', name: 'Trail mix with nuts and seeds', calories: 220 }
        ]
      },
      {
        day: 'Tuesday',
        items: [
          { type: 'breakfast', name: 'Avocado toast with cherry tomatoes', calories: 380 },
          { type: 'lunch', name: 'Chickpea salad with tahini dressing', calories: 450 },
          { type: 'dinner', name: 'Eggplant parmesan with side salad', calories: 540 },
          { type: 'snack', name: 'Hummus with vegetable sticks', calories: 210 }
        ]
      },
      {
        day: 'Wednesday',
        items: [
          { type: 'breakfast', name: 'Greek yogurt with granola and honey', calories: 360 },
          { type: 'lunch', name: 'Quinoa bowl with roasted vegetables', calories: 470 },
          { type: 'dinner', name: 'Bean and vegetable chili', calories: 510 },
          { type: 'snack', name: 'Fruit smoothie', calories: 230 }
        ]
      }
    ]
  }
];

export default function MealPlans() {
  const { goals } = useUser();
  const { toast } = useToast();
  const [activePlan, setActivePlan] = useState<string | null>(null);
  const [showPlanDetails, setShowPlanDetails] = useState<string | null>(null);

  const handleActivatePlan = (planId: string) => {
    setActivePlan(planId);
    toast({
      title: "Meal Plan Activated",
      description: "Your selected meal plan has been activated.",
    });
  };

  const handleGenerateCustomPlan = () => {
    toast({
      title: "Generating Custom Plan",
      description: "Your personalized meal plan is being created based on your goals and preferences.",
    });
    // In a real app, this would call the AI service to generate a custom plan
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Meal Plans
        </h1>
        <p className="text-muted-foreground">
          Choose from pre-designed meal plans or create a custom plan based on your goals
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Recommended for You</h2>
          <p className="text-sm text-muted-foreground">
            Based on your goal: {goals.healthGoal}
          </p>
        </div>
        <Button onClick={handleGenerateCustomPlan}>
          <Plus className="h-4 w-4 mr-2" />
          Generate Custom Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleMealPlans.map((plan) => (
          <Card key={plan.id} className={`nutribot-card ${activePlan === plan.id ? 'border-primary' : ''}`}>
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="flex flex-wrap gap-2 mt-2">
                {plan.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Duration: {plan.duration}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Daily calories: {plan.calorieTarget}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowPlanDetails(plan.id)}>
                View Details
              </Button>
              <Button 
                variant={activePlan === plan.id ? "secondary" : "default"}
                onClick={() => handleActivatePlan(plan.id)}
              >
                {activePlan === plan.id ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Active
                  </>
                ) : "Activate"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Plan Details Dialog */}
      <Dialog open={!!showPlanDetails} onOpenChange={(open) => !open && setShowPlanDetails(null)}>
        <DialogContent className="max-w-4xl">
          {showPlanDetails && (() => {
            const plan = sampleMealPlans.find(p => p.id === showPlanDetails);
            if (!plan) return null;
            
            return (
              <>
                <DialogHeader>
                  <DialogTitle>{plan.name}</DialogTitle>
                  <DialogDescription>{plan.description}</DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {plan.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Duration: {plan.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Daily calories: {plan.calorieTarget}</span>
                    </div>
                  </div>
                  
                  <Tabs defaultValue={plan.meals[0].day.toLowerCase()}>
                    <TabsList className="mb-4">
                      {plan.meals.map((dayMeal) => (
                        <TabsTrigger key={dayMeal.day} value={dayMeal.day.toLowerCase()}>
                          {dayMeal.day}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {plan.meals.map((dayMeal) => (
                      <TabsContent key={dayMeal.day} value={dayMeal.day.toLowerCase()}>
                        <ScrollArea className="h-[300px] rounded-md border p-4">
                          <div className="space-y-6">
                            {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                              const meal = dayMeal.items.find(item => item.type === mealType);
                              if (!meal) return null;
                              
                              return (
                                <div key={mealType} className="space-y-2">
                                  <h3 className="font-medium capitalize">{mealType}</h3>
                                  <Card>
                                    <CardContent className="p-4">
                                      <div className="flex justify-between items-center">
                                        <div>
                                          <p className="font-medium">{meal.name}</p>
                                          <p className="text-sm text-muted-foreground">{meal.calories} calories</p>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              );
                            })}
                          </div>
                        </ScrollArea>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
                
                <DialogFooter>
                  <Button 
                    variant={activePlan === plan.id ? "secondary" : "default"}
                    onClick={() => {
                      handleActivatePlan(plan.id);
                      setShowPlanDetails(null);
                    }}
                  >
                    {activePlan === plan.id ? "Currently Active" : "Activate This Plan"}
                  </Button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
