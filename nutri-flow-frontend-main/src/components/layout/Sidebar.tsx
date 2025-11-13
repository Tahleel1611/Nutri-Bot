
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  Home, 
  PieChart, 
  CalendarCheck, 
  Utensils, 
  Heart, 
  Settings, 
  LogOut,
  BookOpen,
  LineChart
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

export function Sidebar({ isOpen, closeSidebar }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Meal Plans', href: '/meal-plans', icon: BookOpen },
    { name: 'Diet Plan', href: '/diet-plan', icon: PieChart },
    { name: 'Calorie Logger', href: '/calorie-logger', icon: Utensils },
    { name: 'Nutrition Insights', href: '/nutrition-insights', icon: LineChart },
    { name: 'Diet Preferences', href: '/diet-preferences', icon: Heart },
    { name: 'Profile', href: '/profile', icon: Settings },
  ];
  
  const handleLogout = () => {
    logout();
    closeSidebar();
  };
  
  // If user is not logged in, don't show the sidebar
  if (!user) return null;
  
  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={closeSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar border-r shadow-sm transition-transform duration-300 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <span className="font-bold text-xl text-primary">NutriBot</span>
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={closeSidebar}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="flex items-center border-t p-4">
          <button 
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50"
          >
            <LogOut className="h-5 w-5" />
            Log out
          </button>
        </div>
      </div>
    </>
  );
}
