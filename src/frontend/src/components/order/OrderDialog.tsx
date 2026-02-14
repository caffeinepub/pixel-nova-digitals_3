import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import OrderForm from './OrderForm';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OrderDialogProps {
  open: boolean;
  onOpenChange: () => void;
  prefill?: {
    service?: string;
  };
}

export default function OrderDialog({ open, onOpenChange, prefill }: OrderDialogProps) {
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<bigint | null>(null);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setOrderSuccess(false);
        setOrderId(null);
      }, 300);
    }
  }, [open]);

  const handleSuccess = (id: bigint) => {
    setOrderId(id);
    setOrderSuccess(true);
  };

  const handleClose = () => {
    onOpenChange();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {orderSuccess ? (
          <div className="text-center py-8 space-y-6">
            <div className="inline-flex p-4 rounded-full bg-green-500/10">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold">Order Submitted Successfully!</h3>
              <p className="text-muted-foreground">
                Your order reference: <strong className="text-foreground">#{orderId?.toString()}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                We'll get back to you shortly to discuss your project details.
              </p>
            </div>
            <Button onClick={handleClose} size="lg">
              Close
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Place Your Order</DialogTitle>
              <DialogDescription>
                Fill out the form below and we'll get back to you with a quote.
              </DialogDescription>
            </DialogHeader>
            <OrderForm prefill={prefill} onSuccess={handleSuccess} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
