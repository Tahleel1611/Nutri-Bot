
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { userApi } from '../utils/api';

interface UserGoals {
  calorieTarget: number;
  dietType: string;
  healthGoal: string;
  deficiencies: string[];
}

interface UserProfile {
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  gender: string;
}

interface DailySummary {
  consumedCalories: number;
  remainingCalories: number;
  mealsLogged: number;
  macros: {
    carbs: number;
    protein: number;
    fat: number;
  };
}

interface UserContextType {
  goals: UserGoals;
  profile: UserProfile;
  dailySummary: DailySummary;
  loading: boolean;
  updateGoals: (goals: Partial<UserGoals>) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  fetchDailySummary: () => Promise<void>;
}

const defaultGoals: UserGoals = {
  calorieTarget: 2000,
  dietType: 'balanced',
  healthGoal: 'maintain',
  deficiencies: [],
};

const defaultProfile: UserProfile = {
  name: '',
  age: 30,
  height: 170,
  weight: 70,
  gender: 'not-specified',
};

const defaultDailySummary: DailySummary = {
  consumedCalories: 0,
  remainingCalories: 2000,
  mealsLogged: 0,
  macros: {
    carbs: 0,
    protein: 0,
    fat: 0,
  },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<UserGoals>(defaultGoals);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [dailySummary, setDailySummary] = useState<DailySummary>(defaultDailySummary);
  const [loading, setLoading] = useState(false);

  // Load saved goals and profile on authentication
  useEffect(() => {
    if (user) {
      const savedGoals = localStorage.getItem('nutribot-goals');
      const savedProfile = localStorage.getItem('nutribot-profile');
      
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals));
      }
      
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        // Update profile name from auth if not set
        setProfile(prev => ({
          ...prev,
          name: user.name || prev.name
        }));
      }
      
      fetchDailySummary();
    } else {
      // Reset to defaults when logged out
      setGoals(defaultGoals);
      setProfile(defaultProfile);
      setDailySummary(defaultDailySummary);
    }
  }, [user]);

  const updateGoals = async (newGoals: Partial<UserGoals>) => {
    setLoading(true);
    try {
      const updated = { ...goals, ...newGoals };
      await userApi.updateGoals(updated);
      localStorage.setItem('nutribot-goals', JSON.stringify(updated));
      setGoals(updated);
    } catch (error) {
      console.error('Failed to update goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (newProfile: Partial<UserProfile>) => {
    setLoading(true);
    try {
      const updated = { ...profile, ...newProfile };
      await userApi.updateProfile(updated);
      localStorage.setItem('nutribot-profile', JSON.stringify(updated));
      setProfile(updated);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDailySummary = async () => {
    setLoading(true);
    try {
      // Get daily summary from API
      const data = await userApi.getDailySummary();
      
      // Transform the API response to match our interface
      const summary: DailySummary = {
        consumedCalories: data.consumedCalories,
        remainingCalories: goals.calorieTarget - data.consumedCalories,
        mealsLogged: data.mealsLogged,
        macros: {
          carbs: data.macros.carbs,
          protein: data.macros.protein,
          fat: data.macros.fat,
        },
      };
      
      setDailySummary(summary);
    } catch (error) {
      console.error('Failed to fetch daily summary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        goals,
        profile,
        dailySummary,
        loading,
        updateGoals,
        updateProfile,
        fetchDailySummary,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
