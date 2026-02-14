import { useState, useEffect } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminBootstrapStatus } from '@/hooks/useAdminBootstrapStatus';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { classifyAdminAuthError } from '@/utils/adminSetupRecovery';
import { toast } from 'sonner';

export default function AdminLogin() {
  const { login, isLoading, error } = useAdminAuth();
  const { 
    createDefaultAdmin, 
    getSeededCredentials,
    createdCredentials,
    recheckStatus,
    capabilities 
  } = useAdminBootstrapStatus();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);

  const seededCredentials = getSeededCredentials();

  // Prefill seeded credentials on mount if fields are empty
  useEffect(() => {
    if (seededCredentials && !email && !password) {
      setEmail(seededCredentials.email);
      setPassword(seededCredentials.password);
    }
  }, [seededCredentials, email, password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError(null);
    
    try {
      await login(email, password);
    } catch (err) {
      // Error is already handled by useAdminAuth
    }
  };

  const handleRecovery = async () => {
    setIsRecovering(true);
    setRecoveryError(null);

    try {
      const success = await createDefaultAdmin();
      if (success) {
        // Prefill the newly created credentials
        setEmail(seededCredentials.email);
        setPassword(seededCredentials.password);
        await recheckStatus();
      } else {
        setRecoveryError('Admin account already exists. Please use your existing credentials.');
      }
    } catch (err: any) {
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Failed to initialize admin account';
      setRecoveryError(errorMessage);
    } finally {
      setIsRecovering(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  // Classify the error to determine if recovery is possible
  const errorClassification = error ? classifyAdminAuthError(error) : null;
  const showRecoveryOption = errorClassification?.category === 'admin-not-setup' && capabilities.hasCreateDefaultAdmin;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>
            This admin panel is deprecated and no longer requires authentication. Access is now public.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {createdCredentials && (
            <Alert className="border-chart-2 bg-chart-2/10">
              <CheckCircle2 className="h-4 w-4 text-chart-2" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">Admin account created successfully!</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Email: {createdCredentials.email}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(createdCredentials.email, 'Email')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Password: {createdCredentials.password}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(createdCredentials.password, 'Password')}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    You can now log in with these credentials.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {recoveryError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{recoveryError}</AlertDescription>
            </Alert>
          )}

          {showRecoveryOption && (
            <Alert className="border-chart-3 bg-chart-3/10">
              <AlertCircle className="h-4 w-4 text-chart-3" />
              <AlertDescription>
                <div className="space-y-2">
                  <p>Admin account needs to be initialized.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRecovery}
                    disabled={isRecovering}
                  >
                    {isRecovering ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      'Initialize Admin Account'
                    )}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
