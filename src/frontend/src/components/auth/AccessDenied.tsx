import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

interface AccessDeniedProps {
  message?: string;
  onReturnToLogin?: () => void;
}

export default function AccessDenied({ 
  message = 'You do not have permission to access this resource.',
  onReturnToLogin 
}: AccessDeniedProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-destructive">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Access Denied</CardTitle>
          <CardDescription className="text-base">{message}</CardDescription>
        </CardHeader>
        {onReturnToLogin && (
          <CardContent>
            <Button
              onClick={onReturnToLogin}
              variant="outline"
              className="w-full"
            >
              Return to Login
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
