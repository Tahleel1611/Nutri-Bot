
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { forgotPassword, loading } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await forgotPassword(email);
      setSubmitted(true);
      toast({
        title: "Email sent",
        description: "If an account exists with that email, we've sent password reset instructions",
      });
    } catch (error) {
      toast({
        title: "Failed to send email",
        description: "There was a problem sending the reset email",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md animate-fade-in">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
            <CardDescription className="text-center">
              Enter your email address and we'll send you a link to reset your password
            </CardDescription>
          </CardHeader>
          
          {submitted ? (
            <CardContent className="space-y-4 pt-4">
              <div className="text-center p-4">
                <p className="mb-4">Check your inbox for the reset link.</p>
                <Link to="/login" className="text-primary hover:underline">
                  Return to login
                </Link>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send reset link'}
                </Button>
                
                <div className="text-center text-sm">
                  Remember your password?{' '}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
