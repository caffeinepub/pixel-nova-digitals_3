import { useAdminBootstrap } from '@/hooks/useAdminBootstrap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, Key, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminBootstrap() {
  const {
    isLoading,
    defaultCredentials,
    credentialsShown,
    error,
    createDefaultAdmin,
    acknowledgeCredentials
  } = useAdminBootstrap();

  const [copiedField, setCopiedField] = useState<'username' | 'password' | null>(null);

  const handleCopy = (text: string, field: 'username' | 'password') => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field === 'username' ? 'Username' : 'Password'} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateAdmin = async () => {
    const success = await createDefaultAdmin();
    if (!success) {
      toast.error(error || 'Failed to create default admin account');
    }
  };

  const handleAcknowledge = () => {
    acknowledgeCredentials();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-chart-1 mx-auto" />
          <p className="text-muted-foreground">Setting up admin account...</p>
        </div>
      </div>
    );
  }

  if (credentialsShown && defaultCredentials) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-2xl border-chart-1">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-6 w-6 text-chart-1" />
              <CardTitle className="text-2xl">Default Admin Credentials</CardTitle>
            </div>
            <CardDescription>
              These are the default credentials for the admin account. Save them securely.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Important Security Notice</AlertTitle>
              <AlertDescription>
                These default credentials will only be displayed once. Make sure to save them in a secure location
                before continuing. You will not be able to retrieve them again.
              </AlertDescription>
            </Alert>

            <div className="space-y-4 bg-muted/50 p-6 rounded-lg border border-border">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-background px-4 py-3 rounded border border-border font-mono text-lg">
                    {defaultCredentials.username}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(defaultCredentials.username, 'username')}
                  >
                    {copiedField === 'username' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Password</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-background px-4 py-3 rounded border border-border font-mono text-lg">
                    {defaultCredentials.password}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopy(defaultCredentials.password, 'password')}
                  >
                    {copiedField === 'password' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                onClick={handleAcknowledge}
                className="w-full bg-gradient-to-r from-chart-1 to-chart-4 hover:opacity-90"
              >
                I have saved the credentials, continue to login
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                After clicking continue, you will be redirected to the login page
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Admin Setup Required</CardTitle>
          <CardDescription>
            No admin account exists. Create the default admin account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Alert>
            <Key className="h-4 w-4" />
            <AlertTitle>First-time Setup</AlertTitle>
            <AlertDescription>
              This will create the default admin account with username <strong>vishal957041</strong> and 
              password <strong>Abhishek@2006</strong>. The credentials will be displayed only once for confirmation.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleCreateAdmin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-chart-1 to-chart-4 hover:opacity-90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Admin Account...
              </>
            ) : (
              'Create Default Admin Account'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
