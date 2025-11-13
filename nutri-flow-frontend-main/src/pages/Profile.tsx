
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/components/ui/use-toast';
import { LogOut, UserCircle } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const { profile, updateProfile } = useUser();
  
  const [name, setName] = useState(profile.name || (user?.name || ''));
  const [age, setAge] = useState(profile.age.toString());
  const [height, setHeight] = useState(profile.height.toString());
  const [weight, setWeight] = useState(profile.weight.toString());
  const [gender, setGender] = useState(profile.gender);
  
  useEffect(() => {
    // Update form when profile data changes
    setName(profile.name || (user?.name || ''));
    setAge(profile.age.toString());
    setHeight(profile.height.toString());
    setWeight(profile.weight.toString());
    setGender(profile.gender);
  }, [profile, user]);
  
  const handleSave = () => {
    updateProfile({
      name,
      age: parseInt(age),
      height: parseFloat(height),
      weight: parseFloat(weight),
      gender
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved",
    });
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Your Profile
          </h1>
          <p className="text-muted-foreground">
            Manage your personal information and settings
          </p>
        </div>
        
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="nutribot-card md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle>{user?.name || "User"}</CardTitle>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account Type</span>
                <span>Free Plan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span>April 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="nutribot-card md:col-span-3">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={gender}
                    onValueChange={setGender}
                  >
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="not-specified">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="120"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    min="1"
                    max="300"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="1"
                    max="500"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
