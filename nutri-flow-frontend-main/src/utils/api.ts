// API utility functions for NutriBot

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/';
const AI_SERVICE_URL = import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:5001/api/';

// Helper function for making API requests
async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('nutribot-token');
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const url = `${API_URL}${endpoint}`;
  console.log(`API Request: ${options.method || 'GET'} ${url}`, {
    hasToken: !!token,
    headers: defaultHeaders
  });
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
  
  console.log(`API Response: ${response.status} ${response.statusText}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    console.error('API Error:', error);
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Helper function for making AI service requests
async function fetchAiService(endpoint: string, options: RequestInit = {}) {
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const url = `${AI_SERVICE_URL}${endpoint}`;
  console.log(`AI Service Request: ${options.method || 'POST'} ${url}`);
  
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });
  
  console.log(`AI Service Response: ${response.status} ${response.statusText}`);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    console.error('AI Service Error:', error);
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

// Auth API endpoints
export const authApi = {
  login: async (email: string, password: string) => {
    const response = await fetchApi('auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    // Store token if login successful
    if (response.accessToken) {
      localStorage.setItem('nutribot-token', response.accessToken);
    }
    return response;
  },
    
  signup: async (name: string, email: string, password: string) => {
    const response = await fetchApi('auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    return response;
  },
    
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
    
  // Get daily summary from nutrient logs
  getDailySummary: (date?: string) => {
    const queryDate = date || new Date().toISOString().split('T')[0];
    return fetchApi(`nutrients/summary/daily?date=${queryDate}`);
  },
    
  // This is for backward compatibility
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

// Nutrition API for food logging
export const nutritionApi = {
  logFood: (foodData: any) => 
    fetchApi('nutrients/log', {
      method: 'POST',
      body: JSON.stringify({
        foodName: foodData.name,
        calories: foodData.calories,
        protein: foodData.protein,
        carbs: foodData.carbs,
        fat: foodData.fat,
        mealType: foodData.mealType,
        servingSize: foodData.quantity || 1,
        servingUnit: foodData.servingSize || 'serving',
        date: foodData.date || new Date().toISOString().split('T')[0]
      })
    }),
    
  getMealHistory: (dateRange?: { start: string, end: string }): Promise<MealHistoryResponse> => 
    fetchApi(`nutrients/history${dateRange ? `?startDate=${dateRange.start}&endDate=${dateRange.end}` : ''}`),
    
  getFoodSuggestions: (query: string) => {
    // For now, return empty array - you can enhance this later with a food database API
    return Promise.resolve([]);
  }
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
