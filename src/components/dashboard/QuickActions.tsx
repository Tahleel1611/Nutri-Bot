
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ListPlus, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

export function QuickActions() {
  return (
    <Card className="nutribot-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          <Link to="/calorie-logger" className="flex flex-col items-center gap-1">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
              <PlusCircle className="h-6 w-6" />
            </Button>
            <span className="text-xs text-center">Log Food</span>
          </Link>
          
          <Link to="/diet-plan" className="flex flex-col items-center gap-1">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
              <ListPlus className="h-6 w-6" />
            </Button>
            <span className="text-xs text-center">View Plan</span>
          </Link>
          
          <Link to="/diet-preferences" className="flex flex-col items-center gap-1">
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
              <Pencil className="h-6 w-6" />
            </Button>
            <span className="text-xs text-center">Edit Goal</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
