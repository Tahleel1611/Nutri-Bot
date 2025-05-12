// API utility functions for NutriBot

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/';
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:5001/api/';

// Helper function for making API requests - currently using mock data
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  console.log(`Mock API call to ${endpoint}`, options);
  
  // Get auth token from localStorage if available
  const userJson = localStorage.getItem('nutribot-user');
  const user = userJson ? JSON.parse(userJson) : null;
  
  // Use mock data instead of actual API calls
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      try {
        // Handle different endpoints with mock responses
        if (endpoint === 'auth/signin' && options.method === 'POST') {
          const body = JSON.parse(options.body as string);
          const { email, password } = body;
          
          // Simple validation
          if (email && password) {
            resolve({
              user: {
                id: '1',
                name: email.split('@')[0],
                email: email
              },
              token: 'mock-jwt-token'
            });
          } else {
            reject(new Error('Invalid credentials'));
          }
        } 
        else if (endpoint === 'auth/signup' && options.method === 'POST') {
          const body = JSON.parse(options.body as string);
          const { name, email, password } = body;
          
          // Simple validation
          if (name && email && password) {
            resolve({
              user: {
                id: '1',
                name: name,
                email: email
              },
              token: 'mock-jwt-token'
            });
          } else {
            reject(new Error('Invalid signup data'));
          }
        }
        else if (endpoint === 'auth/refreshtoken' && options.method === 'POST') {
          resolve({
            token: 'new-mock-jwt-token'
          });
        }
        else if (endpoint === 'users/profile' && options.method === 'GET') {
          resolve({
            id: '1',
            name: user?.name || 'User',
            email: user?.email || 'user@example.com',
            age: 30,
            height: 175,
            weight: 70,
            gender: 'not-specified',
            goals: {
              calorieTarget: 2000,
              dietType: 'balanced',
              healthGoal: 'maintain',
              deficiencies: []
            }
          });
        }
        else if (endpoint === 'users/profile' && options.method === 'PUT') {
          // Just return success for profile updates
          resolve({ success: true });
        }
        else {
          // Default response for other endpoints
          resolve({ message: 'Mock API response' });
        }
      } catch (error) {
        console.error(`Mock API error for ${endpoint}:`, error);
        reject(new Error(`Mock API error: ${error}`));
      }
    }, 500); // 500ms delay to simulate network
  });
}

// Helper function for making AI service requests - currently using mock data
async function fetchAiService(endpoint: string, options: RequestInit = {}) {
  console.log(`Mock AI service call to ${endpoint}`, options);
  
  // Use mock data instead of actual API calls
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      if (endpoint === 'recommendations/meals') {
        resolve({
          meals: [
            {
              id: 'm1',
              name: 'Grilled Chicken Salad',
              calories: 350,
              protein: 35,
              carbs: 15,
              fat: 18,
              ingredients: ['chicken breast', 'mixed greens', 'olive oil', 'lemon juice', 'cherry tomatoes'],
              instructions: 'Grill chicken, mix with greens and other ingredients, dress with olive oil and lemon juice.'
            },
            {
              id: 'm2',
              name: 'Salmon with Roasted Vegetables',
              calories: 420,
              protein: 30,
              carbs: 25,
              fat: 22,
              ingredients: ['salmon fillet', 'broccoli', 'carrots', 'olive oil', 'garlic', 'herbs'],
              instructions: 'Roast vegetables at 400°F for 20 minutes. Cook salmon separately and serve together.'
            },
            {
              id: 'm3',
              name: 'Quinoa Bowl with Avocado',
              calories: 380,
              protein: 12,
              carbs: 45,
              fat: 18,
              ingredients: ['quinoa', 'avocado', 'black beans', 'corn', 'lime juice', 'cilantro'],
              instructions: 'Cook quinoa according to package. Mix with other ingredients and serve warm or cold.'
            }
          ]
        });
      } else if (endpoint === 'analysis/nutrition') {
        resolve({
          calories: 350,
          protein: 25,
          carbs: 30,
          fat: 15,
          vitamins: {
            a: 20, // percent of daily value
            c: 35,
            d: 5,
            e: 10
          },
          minerals: {
            calcium: 15,
            iron: 20,
            potassium: 25
          }
        });
      } else {
        resolve({ message: 'Mock AI service response' });
      }
    }, 800); // 800ms delay to simulate network
  });
}

// Auth API endpoints
export const authApi = {
  login: (email: string, password: string) => 
    fetchApi('auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),
    
  signup: (name: string, email: string, password: string) => 
    fetchApi('auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    }),
    
  refreshToken: (refreshToken: string) => 
    fetchApi('auth/refreshtoken', {
      method: 'POST',
      body: JSON.stringify({ refreshToken })
    })
};

// User API endpoints
export const userApi = {
  getProfile: () => fetchApi('users/profile'),
  
  updateProfile: (profileData: any) => 
    fetchApi('users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    }),
    
  updatePassword: (currentPassword: string, newPassword: string) => 
    fetchApi('users/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    }),
    
  // This endpoint might need to be implemented in the backend
  getDailySummary: () => fetchApi('users/profile'),
  
  // This is for backward compatibility, might need to be implemented in the backend
  updateGoals: (goalsData: any) => 
    fetchApi('users/profile', {
      method: 'PUT',
      body: JSON.stringify({ goals: goalsData })
    })
};

// Response type for meal history
interface MealHistoryResponse {
  meals: Array<{
    foodId: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servingSize: string;
    mealType: string;
  }>;
}

// Nutrition API for backward compatibility with CalorieLogger component
export const nutritionApi = {
  logFood: (foodData: any) => 
    mealApi.createMeal({
      name: foodData.name,
      calories: foodData.calories,
      protein: foodData.protein,
      carbs: foodData.carbs,
      fat: foodData.fat,
      mealType: foodData.mealType,
      quantity: foodData.quantity,
      servingSize: foodData.servingSize
    }),
    
  getMealHistory: (dateRange?: { start: string, end: string }): Promise<MealHistoryResponse> => 
    mealApi.getAllMeals() as Promise<MealHistoryResponse>,
    
  getFoodSuggestions: (query: string) => 
    mealApi.getRecommendedMeals()
};

// Meal API endpoints
export const mealApi = {
  getAllMeals: () => fetchApi('meals'),
  
  getMealById: (id: string) => fetchApi(`meals/${id}`),
  
  createMeal: (mealData: any) => 
    fetchApi('meals', {
      method: 'POST',
      body: JSON.stringify(mealData)
    }),
    
  updateMeal: (id: string, mealData: any) => 
    fetchApi(`meals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mealData)
    }),
    
  deleteMeal: (id: string) => 
    fetchApi(`meals/${id}`, {
      method: 'DELETE'
    }),
    
  getRecommendedMeals: () => fetchApi('meals/recommended')
};

// Plan API endpoints
export const planApi = {
  getUserPlans: () => fetchApi('plans'),
  
  getPlanById: (id: string) => fetchApi(`plans/${id}`),
  
  createPlan: (planData: any) => 
    fetchApi('plans', {
      method: 'POST',
      body: JSON.stringify(planData)
    }),
    
  updatePlan: (id: string, planData: any) => 
    fetchApi(`plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(planData)
    }),
    
  deletePlan: (id: string) => 
    fetchApi(`plans/${id}`, {
      method: 'DELETE'
    }),
    
  generateAiPlan: (preferences: any) => 
    fetchApi('plans/generate', {
      method: 'POST',
      body: JSON.stringify(preferences)
    }),
    
  addMealToPlan: (planId: string, mealId: string) => 
    fetchApi(`plans/${planId}/meals/${mealId}`, {
      method: 'POST'
    }),
    
  removeMealFromPlan: (planId: string, mealId: string) => 
    fetchApi(`plans/${planId}/meals/${mealId}`, {
      method: 'DELETE'
    })
};

// AI service endpoints
export const aiApi = {
  getMealRecommendations: (preferences: any) => 
    fetchAiService('recommendations/meals', {
      method: 'POST',
      body: JSON.stringify(preferences)
    }),
    
  getNutritionAnalysis: (foodData: any) => 
    fetchAiService('analysis/nutrition', {
      method: 'POST',
      body: JSON.stringify(foodData)
    })
};

export default {
  auth: authApi,
  user: userApi,
  meal: mealApi,
  plan: planApi,
  ai: aiApi
};
