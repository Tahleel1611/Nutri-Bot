import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/contexts/UserContext';
import { aiApi } from '@/utils/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

// Sample nutrition data
const sampleNutritionData = {
  macroDistribution: [
    { name: 'Protein', value: 25 },
    { name: 'Carbs', value: 45 },
    { name: 'Fat', value: 30 }
  ],
  calorieIntake: [
    { day: 'Mon', calories: 1850, target: 2000 },
    { day: 'Tue', calories: 2100, target: 2000 },
    { day: 'Wed', calories: 1920, target: 2000 },
    { day: 'Thu', calories: 1750, target: 2000 },
    { day: 'Fri', calories: 2200, target: 2000 },
    { day: 'Sat', calories: 2350, target: 2000 },
    { day: 'Sun', calories: 1900, target: 2000 }
  ],
  nutrientIntake: [
    { nutrient: 'Vitamin A', percentage: 85 },
    { nutrient: 'Vitamin C', percentage: 120 },
    { nutrient: 'Vitamin D', percentage: 60 },
    { nutrient: 'Calcium', percentage: 75 },
    { nutrient: 'Iron', percentage: 90 },
    { nutrient: 'Potassium', percentage: 65 },
    { nutrient: 'Fiber', percentage: 80 }
  ],
  mealDistribution: [
    { name: 'Breakfast', calories: 450 },
    { name: 'Lunch', calories: 650 },
    { name: 'Dinner', calories: 700 },
    { name: 'Snacks', calories: 200 }
  ],
  weeklyProgress: [
    { week: 'Week 1', weight: 75.0, bodyFat: 22 },
    { week: 'Week 2', weight: 74.5, bodyFat: 21.5 },
    { week: 'Week 3', weight: 74.0, bodyFat: 21 },
    { week: 'Week 4', weight: 73.6, bodyFat: 20.8 }
  ],
  deficiencies: [
    { nutrient: 'Vitamin D', status: 'Low', recommendation: 'Consider more sun exposure or supplements' },
    { nutrient: 'Potassium', status: 'Moderate', recommendation: 'Add more bananas, potatoes, and leafy greens' },
    { nutrient: 'Calcium', status: 'Moderate', recommendation: 'Increase dairy or fortified plant milks' }
  ]
};

// Colors for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function NutritionInsights() {
  const { goals, profile } = useUser();
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState('week');
  const [isLoading, setIsLoading] = useState(false);
  const [insightsData, setInsightsData] = useState(sampleNutritionData);

  const handleRefreshInsights = async () => {
    setIsLoading(true);
    toast({
      title: "Refreshing Insights",
      description: "Analyzing your nutrition data...",
    });

    try {
      // In a real app, this would call the AI service to get personalized insights
      // const data = await aiApi.getNutritionAnalysis({ userId: profile.id });
      // setInsightsData(data);
      
      // Using sample data for now
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Insights Updated",
          description: "Your nutrition insights have been refreshed with the latest data.",
        });
      }, 1500);
    } catch (error) {
      console.error('Error refreshing insights:', error);
      setIsLoading(false);
      toast({
        title: "Error Refreshing Insights",
        description: "There was a problem analyzing your nutrition data. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Nutrition Insights
          </h1>
          <p className="text-muted-foreground">
            Detailed analysis of your dietary patterns and nutritional intake
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="3months">Past 3 Months</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefreshInsights} disabled={isLoading}>
            {isLoading ? "Analyzing..." : "Refresh Insights"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="macros">Macronutrients</TabsTrigger>
          <TabsTrigger value="calories">Calorie Intake</TabsTrigger>
          <TabsTrigger value="nutrients">Nutrient Analysis</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Daily Calorie Average</CardTitle>
                <CardDescription>Based on your recent meals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold">
                  {Math.round(insightsData.calorieIntake.reduce((sum, day) => sum + day.calories, 0) / insightsData.calorieIntake.length)}
                </div>
                <p className="text-sm text-muted-foreground">
                  calories per day
                </p>
                <p className={`text-sm mt-2 ${goals.calorieTarget > Math.round(insightsData.calorieIntake.reduce((sum, day) => sum + day.calories, 0) / insightsData.calorieIntake.length) ? 'text-green-500' : 'text-red-500'}`}>
                  {goals.calorieTarget > Math.round(insightsData.calorieIntake.reduce((sum, day) => sum + day.calories, 0) / insightsData.calorieIntake.length) 
                    ? `${goals.calorieTarget - Math.round(insightsData.calorieIntake.reduce((sum, day) => sum + day.calories, 0) / insightsData.calorieIntake.length)} under target`
                    : `${Math.round(insightsData.calorieIntake.reduce((sum, day) => sum + day.calories, 0) / insightsData.calorieIntake.length) - goals.calorieTarget} over target`
                  }
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Macro Distribution</CardTitle>
                <CardDescription>Protein, carbs, and fat ratio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={insightsData.macroDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {insightsData.macroDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Meal Distribution</CardTitle>
                <CardDescription>Calories by meal type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={insightsData.mealDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="calories" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Nutritional Deficiencies</CardTitle>
              <CardDescription>Areas that may need attention in your diet</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insightsData.deficiencies.map((deficiency, index) => (
                  <div key={index} className="border-b pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{deficiency.nutrient}</h4>
                        <p className="text-sm text-muted-foreground">Status: {deficiency.status}</p>
                      </div>
                      <div className="text-sm max-w-[50%] text-right">
                        {deficiency.recommendation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Macronutrients Tab */}
        <TabsContent value="macros" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Macronutrient Distribution</CardTitle>
              <CardDescription>Breakdown of your protein, carbohydrate, and fat intake</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={insightsData.macroDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value}g (${(percent * 100).toFixed(0)}%)`}
                    >
                      {insightsData.macroDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Recommendations</h3>
                <p>Based on your {goals.dietType} diet goal, your ideal macronutrient distribution should be:</p>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <div className="p-4 bg-secondary rounded-lg text-center">
                    <div className="text-2xl font-bold">30%</div>
                    <div className="text-sm">Protein</div>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg text-center">
                    <div className="text-2xl font-bold">40%</div>
                    <div className="text-sm">Carbs</div>
                  </div>
                  <div className="p-4 bg-secondary rounded-lg text-center">
                    <div className="text-2xl font-bold">30%</div>
                    <div className="text-sm">Fat</div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Consider adjusting your meals to better align with these targets for optimal results.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Calorie Intake Tab */}
        <TabsContent value="calories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Calorie Intake</CardTitle>
              <CardDescription>Your calorie consumption compared to your target</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={insightsData.calorieIntake}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="calories" stroke="#8884d8" activeDot={{ r: 8 }} name="Actual Calories" />
                    <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeDasharray="5 5" name="Target Calories" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Calorie Analysis</h3>
                <p>
                  Your average daily calorie intake is{' '}
                  <span className="font-medium">
                    {Math.round(insightsData.calorieIntake.reduce((sum, day) => sum + day.calories, 0) / insightsData.calorieIntake.length)}
                  </span>{' '}
                  calories, which is{' '}
                  <span className={`font-medium ${goals.calorieTarget > Math.round(insightsData.calorieIntake.reduce((sum, day) => sum + day.calories, 0) / insightsData.calorieIntake.length) ? 'text-green-500' : 'text-red-500'}`}>
                    {goals.calorieTarget > Math.round(insightsData.calorieIntake.reduce((sum, day) => sum + day.calories, 0) / insightsData.calorieIntake.length) 
                      ? `${goals.calorieTarget - Math.round(insightsData.calorieIntake.reduce((sum, day) => sum + day.calories, 0) / insightsData.calorieIntake.length)} under`
                      : `${Math.round(insightsData.calorieIntake.reduce((sum, day) => sum + day.calories, 0) / insightsData.calorieIntake.length) - goals.calorieTarget} over`
                    }
                  </span>{' '}
                  your daily target of {goals.calorieTarget} calories.
                </p>
                
                <div className="bg-secondary p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Recommendation</h4>
                  {goals.calorieTarget > Math.round(insightsData.calorieIntake.reduce((sum, day) => sum + day.calories, 0) / insightsData.calorieIntake.length) ? (
                    <p className="text-sm">
                      You're consistently under your calorie target. Consider adding more nutrient-dense foods to your meals
                      to ensure you're getting enough energy for your {goals.healthGoal} goal.
                    </p>
                  ) : (
                    <p className="text-sm">
                      You're slightly exceeding your calorie target. Consider reducing portion sizes or swapping some
                      higher-calorie items for lower-calorie alternatives to better align with your {goals.healthGoal} goal.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Nutrient Analysis Tab */}
        <TabsContent value="nutrients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Micronutrient Analysis</CardTitle>
              <CardDescription>Percentage of daily recommended intake for key nutrients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={insightsData.nutrientIntake} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 150]} />
                    <YAxis dataKey="nutrient" type="category" width={100} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Daily Value']} />
                    <Legend />
                    <Bar dataKey="percentage" fill="#8884d8" name="% of Daily Value">
                      {insightsData.nutrientIntake.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.percentage < 70 ? '#ff8042' : entry.percentage > 100 ? '#00C49F' : '#FFBB28'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Nutrient Insights</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="inline-block w-3 h-3 bg-[#ff8042] mr-2 rounded-sm"></span>
                    <span className="font-medium">Red bars</span> indicate nutrients below 70% of daily recommended intake.
                  </p>
                  <p className="text-sm">
                    <span className="inline-block w-3 h-3 bg-[#FFBB28] mr-2 rounded-sm"></span>
                    <span className="font-medium">Yellow bars</span> indicate nutrients between 70-100% of daily recommended intake.
                  </p>
                  <p className="text-sm">
                    <span className="inline-block w-3 h-3 bg-[#00C49F] mr-2 rounded-sm"></span>
                    <span className="font-medium">Green bars</span> indicate nutrients exceeding 100% of daily recommended intake.
                  </p>
                </div>
                
                <div className="bg-secondary p-4 rounded-lg mt-4">
                  <h4 className="font-medium mb-2">Personalized Recommendations</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    {insightsData.deficiencies.map((deficiency, index) => (
                      <li key={index}>
                        <span className="font-medium">{deficiency.nutrient}:</span> {deficiency.recommendation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Progress Tab */}
        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Body Composition Progress</CardTitle>
              <CardDescription>Tracking your weight and body fat percentage over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={insightsData.weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} name="Weight (kg)" />
                    <Line yAxisId="right" type="monotone" dataKey="bodyFat" stroke="#82ca9d" name="Body Fat %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Progress Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Weight Change</p>
                    <p className="text-2xl font-bold text-green-500">
                      -{(insightsData.weeklyProgress[0].weight - insightsData.weeklyProgress[insightsData.weeklyProgress.length - 1].weight).toFixed(1)} kg
                    </p>
                    <p className="text-sm text-muted-foreground">
                      From {insightsData.weeklyProgress[0].weight} kg to {insightsData.weeklyProgress[insightsData.weeklyProgress.length - 1].weight} kg
                    </p>
                  </div>
                  <div className="bg-secondary p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Body Fat Change</p>
                    <p className="text-2xl font-bold text-green-500">
                      -{(insightsData.weeklyProgress[0].bodyFat - insightsData.weeklyProgress[insightsData.weeklyProgress.length - 1].bodyFat).toFixed(1)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      From {insightsData.weeklyProgress[0].bodyFat}% to {insightsData.weeklyProgress[insightsData.weeklyProgress.length - 1].bodyFat}%
                    </p>
                  </div>
                </div>
                
                <div className="bg-secondary p-4 rounded-lg mt-4">
                  <h4 className="font-medium mb-2">Progress Analysis</h4>
                  <p className="text-sm">
                    You're making steady progress toward your {goals.healthGoal} goal. Your current rate of weight loss is approximately
                    {((insightsData.weeklyProgress[0].weight - insightsData.weeklyProgress[insightsData.weeklyProgress.length - 1].weight) / insightsData.weeklyProgress.length).toFixed(2)} kg per week,
                    which is within the healthy range of 0.5-1 kg per week. Continue with your current nutrition and exercise plan for optimal results.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
