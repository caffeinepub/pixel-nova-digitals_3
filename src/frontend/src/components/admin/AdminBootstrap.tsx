import { useState } from 'react';
import { useAdminBootstrapStatus } from '@/hooks/useAdminBootstrapStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminBootstrap() {
  const { createDefaultAdmin, createdCredentials, isLoading, error } = useAdminBootstrapStatus();
  const [isCreating, setIsCreating] = useState(false);
  const [creationError, setCreationError] = useState<string | null>(null);

  const handleCreateAdmin = async () => {
    setIsCreating(true);
    setCreationError(null);

    try {
      const success = await createDefaultAdmin();
      if (!success) {
        setCreationError('Failed to create admin account. It may already exist.');
      }
    } catch (err: any) {
      const errorMessage = typeof err === 'string' ? err : err?.message || 'Failed to create admin account';
      setCreationError(errorMessage);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-chart-1" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Admin Setup</CardTitle>
          <CardDescription>
            This admin panel is deprecated and no longer requires authentication. This setup screen is no longer needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {creationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{creationError}</AlertDescription>
            </Alert>
          )}

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
                    Please save these credentials. You can now proceed to login.
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {!createdCredentials && (
            <>
              <p className="text-sm text-muted-foreground">
                Initialize the default admin account to get started. This will create an admin account with pre-configured credentials.
              </p>
              <Button
                onClick={handleCreateAdmin}
                disabled={isCreating}
                className="w-full"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Admin Account...
                  </>
                ) : (
                  'Create Admin Account'
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
