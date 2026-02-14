import { useState } from 'react';
import { useGetAllOrders, useDownloadFile, useDeleteOrder } from '@/hooks/useQueries';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, Download, Trash2, AlertCircle } from 'lucide-react';
import { NewOrder } from '@/backend';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { serviceCatalog } from '@/components/services/serviceCatalog';
import { toast } from 'sonner';

export default function OrdersAdmin() {
  const { data: orders, isLoading, error } = useGetAllOrders();
  const downloadFileMutation = useDownloadFile();
  const deleteOrderMutation = useDeleteOrder();
  
  const [selectedOrder, setSelectedOrder] = useState<NewOrder | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<NewOrder | null>(null);
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  const formatDate = (timestamp: bigint) => {
    try {
      const date = new Date(Number(timestamp) / 1_000_000);
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  const handleDownloadFile = async (order: NewOrder) => {
    try {
      const fileBytes = await downloadFileMutation.mutateAsync(order.id);
      
      if (fileBytes.length === 0) {
        toast.error('No file attached to this order');
        return;
      }

      const regularBytes = new Uint8Array(fileBytes);
      const blob = new Blob([regularBytes]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `order-${order.id}-file`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully');
    } catch (error: any) {
      console.error('Download failed:', error);
      toast.error(error?.message || 'Failed to download file');
    }
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;
    
    try {
      await deleteOrderMutation.mutateAsync(orderToDelete.id);
      toast.success('Order deleted successfully');
      setOrderToDelete(null);
      if (selectedOrder?.id === orderToDelete.id) {
        setSelectedOrder(null);
      }
    } catch (error: any) {
      console.error('Delete failed:', error);
      toast.error(error?.message || 'Failed to delete order');
    }
  };

  const filteredOrders = orders?.filter((order) => {
    const serviceMatch = serviceFilter === 'all' || order.service === serviceFilter;
    return serviceMatch;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-chart-1" />
      </div>
    );
  }

  // Display error in-place without triggering logout
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error instanceof Error ? error.message : 'Failed to load orders. Please try refreshing the page.'}
        </AlertDescription>
      </Alert>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>No orders have been submitted yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Orders Management</h2>
          <p className="text-muted-foreground">
            View and manage all customer orders. Total orders: {orders.length}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Filter by Service</Label>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {serviceCatalog.map((service) => (
                    <SelectItem key={service.id} value={service.title}>
                      {service.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id.toString()}>
                      <TableCell className="font-mono text-sm">
                        #{order.id.toString()}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{order.fullName}</p>
                          <p className="text-xs text-muted-foreground">{order.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.service}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(order.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadFile(order)}
                            disabled={downloadFileMutation.isPending}
                          >
                            {downloadFileMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setOrderToDelete(order)}
                            disabled={deleteOrderMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrder?.id.toString()}</DialogTitle>
            <DialogDescription>
              Submitted on {selectedOrder && formatDate(selectedOrder.timestamp)}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Customer Name</Label>
                  <p className="font-medium">{selectedOrder.fullName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium">{selectedOrder.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">WhatsApp</Label>
                  <p className="font-medium">{selectedOrder.whatsapp}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Service</Label>
                  <p className="font-medium">{selectedOrder.service}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Budget</Label>
                  <p className="font-medium">{selectedOrder.budget}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Delivery Time</Label>
                  <p className="font-medium">{selectedOrder.deliveryTime}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="mt-1 text-sm whitespace-pre-wrap">
                  {selectedOrder.description}
                </p>
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => handleDownloadFile(selectedOrder)}
                  disabled={downloadFileMutation.isPending}
                  className="flex-1"
                >
                  {downloadFileMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download File
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setOrderToDelete(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  disabled={deleteOrderMutation.isPending}
                  className="flex-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!orderToDelete} onOpenChange={() => setOrderToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete order #{orderToDelete?.id.toString()}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrder}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteOrderMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
