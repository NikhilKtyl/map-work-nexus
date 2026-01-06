import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Zap, ArrowLeft, Loader2 } from 'lucide-react';

type AuthView = 'login' | 'forgot-password' | 'reset-sent';

const Auth: React.FC = () => {
  const [view, setView] = useState<AuthView>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Welcome back!',
        description: 'Successfully logged in to BerryTech.',
      });
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await resetPassword(email);
    setIsLoading(false);

    if (result.success) {
      setView('reset-sent');
    } else {
      setError(result.error || 'Failed to send reset email');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-dark flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center glow-primary">
            <Zap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">BerryTech</span>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-foreground leading-tight">
            Fiber Project<br />Management
          </h1>
          <p className="text-lg text-foreground/70 max-w-md">
            Streamline your telecom projects from planning to completion. 
            Track crews, manage units, and deliver on time.
          </p>
          <div className="flex gap-8 pt-4">
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <div className="text-sm text-foreground/60">Projects Managed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success">98%</div>
              <div className="text-sm text-foreground/60">On-Time Delivery</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-secondary">50k+</div>
              <div className="text-sm text-foreground/60">Units Completed</div>
            </div>
          </div>
        </div>

        <div className="text-sm text-foreground/50">
          © 2024 BerryTech. All rights reserved.
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-card">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-card-foreground">BerryTech</span>
          </div>

          {view === 'login' && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-card-foreground">Welcome back</h2>
                <p className="text-muted-foreground mt-1">Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-card-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-muted border-border text-card-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-card-foreground">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 bg-muted border-border text-card-foreground"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setView('forgot-password')}
                    className="text-sm text-primary hover:text-primary-dark transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>

              <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground mb-2">Demo credentials:</p>
                <code className="text-xs text-card-foreground">admin@berrytech.com / admin123</code>
              </div>
            </>
          )}

          {view === 'forgot-password' && (
            <>
              <button
                onClick={() => setView('login')}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-card-foreground mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-card-foreground">Reset password</h2>
                <p className="text-muted-foreground mt-1">
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-card-foreground">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 bg-muted border-border text-card-foreground placeholder:text-muted-foreground"
                    required
                  />
                </div>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 gradient-primary hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Send reset link'
                  )}
                </Button>
              </form>
            </>
          )}

          {view === 'reset-sent' && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-card-foreground mb-2">Check your email</h2>
              <p className="text-muted-foreground mb-6">
                We've sent a password reset link to<br />
                <span className="text-card-foreground font-medium">{email}</span>
              </p>
              <Button
                onClick={() => setView('login')}
                variant="outline"
                className="border-border text-card-foreground hover:bg-muted"
              >
                Back to login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
