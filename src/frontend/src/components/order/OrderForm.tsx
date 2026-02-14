import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateOrder } from '@/hooks/useQueries';
import { Loader2, Upload, X } from 'lucide-react';
import { serviceCatalog } from '@/components/services/serviceCatalog';
import { fileToBytes } from '@/utils/fileToBytes';
import { toast } from 'sonner';

interface OrderFormProps {
  onSuccess: (orderId: bigint) => void;
  prefill?: {
    service?: string;
  };
}

interface OrderFormData {
  service: string;
  fullName: string;
  email: string;
  whatsapp: string;
  description: string;
  budget: string;
  deliveryTime: string;
}

export default function OrderForm({ onSuccess, prefill }: OrderFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<OrderFormData>({
    defaultValues: {
      service: prefill?.service || '',
      budget: '',
      deliveryTime: '',
    },
  });

  const createOrderMutation = useCreateOrder();
  const [file, setFile] = useState<File | null>(null);

  const selectedService = watch('service');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const onSubmit = async (data: OrderFormData) => {
    try {
      let fileBytes: Uint8Array;
      if (file) {
        fileBytes = await fileToBytes(file);
      } else {
        fileBytes = new Uint8Array(0);
      }

      const orderId = await createOrderMutation.mutateAsync({
        service: data.service,
        fullName: data.fullName,
        email: data.email,
        whatsapp: data.whatsapp,
        description: data.description,
        fileUpload: fileBytes,
        budget: data.budget,
        deliveryTime: data.deliveryTime,
      });

      onSuccess(orderId);
    } catch (error: any) {
      console.error('Order submission failed:', error);
      toast.error(error?.message || 'Failed to submit order. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="service">Service *</Label>
        <Select
          value={selectedService}
          onValueChange={(value) => setValue('service', value)}
        >
          <SelectTrigger id="service">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            {serviceCatalog.map((service) => (
              <SelectItem key={service.id} value={service.title}>
                {service.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.service && (
          <p className="text-sm text-destructive">Service is required</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            {...register('fullName', { required: true })}
            placeholder="Your full name"
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">Full name is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email', { required: true })}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="text-sm text-destructive">Email is required</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp Number *</Label>
        <Input
          id="whatsapp"
          {...register('whatsapp', { required: true })}
          placeholder="+91 XXXXX XXXXX"
        />
        {errors.whatsapp && (
          <p className="text-sm text-destructive">WhatsApp number is required</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Project Description *</Label>
        <Textarea
          id="description"
          {...register('description', { required: true })}
          placeholder="Describe your project requirements in detail..."
          rows={4}
        />
        {errors.description && (
          <p className="text-sm text-destructive">Description is required</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file-upload">File Upload (Optional)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="cursor-pointer"
            accept="image/*,video/*,.pdf,.doc,.docx"
          />
          {file && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={removeFile}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        {file && (
          <p className="text-sm text-muted-foreground">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Max file size: 10MB. Supported formats: Images, Videos, PDF, DOC, DOCX
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="budget">Budget *</Label>
          <Input
            id="budget"
            {...register('budget', { required: true })}
            placeholder="e.g., Rs 5000-10000"
          />
          {errors.budget && (
            <p className="text-sm text-destructive">Budget is required</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deliveryTime">Expected Delivery Time *</Label>
          <Input
            id="deliveryTime"
            {...register('deliveryTime', { required: true })}
            placeholder="e.g., 7 days"
          />
          {errors.deliveryTime && (
            <p className="text-sm text-destructive">Delivery time is required</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={createOrderMutation.isPending}
      >
        {createOrderMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Submit Order
          </>
        )}
      </Button>
    </form>
  );
}
