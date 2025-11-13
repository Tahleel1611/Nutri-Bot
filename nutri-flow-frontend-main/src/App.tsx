
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserProvider } from "@/contexts/UserContext";
import { Layout } from "@/components/layout/Layout";

import Dashboard from "./pages/Dashboard";
import DietPlan from "./pages/DietPlan";
import CalorieLogger from "./pages/CalorieLogger";
import DietPreferences from "./pages/DietPreferences";
import Profile from "./pages/Profile";
import MealPlans from "./pages/MealPlans";
import NutritionInsights from "./pages/NutritionInsights";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <UserProvider>
          <TooltipProvider>
            <Sonner />
            <Toaster />
            <BrowserRouter>
              <Layout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/meal-plans" element={<MealPlans />} />
                  <Route path="/diet-plan" element={<DietPlan />} />
                  <Route path="/calorie-logger" element={<CalorieLogger />} />
                  <Route path="/nutrition-insights" element={<NutritionInsights />} />
                  <Route path="/diet-preferences" element={<DietPreferences />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </UserProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
