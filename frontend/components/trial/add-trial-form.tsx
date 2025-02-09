import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, parseISO, isValid } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { getUsers, getMotorcycles, getTrials } from '@/lib/api';

export type TrialFormValues = {
  user_id: string;
  motorcycle_id: string;
  start_date: Date;
  end_date: Date;
};

const trialSchema = z.object({
  user_id: z.string().min(1, { message: 'Client requis' }),
  motorcycle_id: z.string().min(1, { message: 'Moto requise' }),
  start_date: z.date({
    required_error: 'Date de début requise',
    invalid_type_error: 'Format de date invalide',
  }),
  end_date: z.date({
    required_error: 'Date de fin requise',
    invalid_type_error: 'Format de date invalide',
  })
}).refine((data) => {
  return data.end_date > data.start_date;
}, {
  message: "La date de fin doit être après la date de début",
  path: ["end_date"]
});

const formatDate = (dateValue: any) => {
  if (!dateValue) return null;
  
  if (dateValue instanceof Date && isValid(dateValue)) {
    return dateValue;
  }
  
  const dateStr = typeof dateValue === "string" ? dateValue : dateValue?.value;
  if (!dateStr) return null;
  
  const parsedDate = parseISO(dateStr);
  return isValid(parsedDate) ? parsedDate : null;
};

export function AddTrialForm({ 
  onSubmit, 
  mode = 'create', 
  defaultValues 
}: { 
  onSubmit: (values: TrialFormValues) => void;
  mode?: 'create' | 'edit';
  defaultValues?: any;
}) {
  const router = useRouter();
  const [clients, setClients] = useState<Array<{ id: string; label: string }>>([]);
  const [motorcycles, setMotorcycles] = useState<Array<{ id: string; label: string }>>([]);
  const [trials, setTrials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableMotorcycles, setAvailableMotorcycles] = useState<Array<{ id: string; label: string }>>([]);

  const formattedDefaultValues = defaultValues ? {
    ...defaultValues,
    start_date: formatDate(defaultValues.start_date),
    end_date: formatDate(defaultValues.end_date)
  } : {
    user_id: '',
    motorcycle_id: '',
    start_date: undefined,
    end_date: undefined,
  };

  const form = useForm<TrialFormValues>({
    resolver: zodResolver(trialSchema),
    defaultValues: formattedDefaultValues,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, motorcyclesData, trialsData] = await Promise.all([
          getUsers(),
          getMotorcycles(),
          getTrials()
        ]);

        const filteredClients = usersData
          .filter(user => user.role.value === 'client')
          .map(user => ({
            id: user.id,
            label: user.username.value
          }));

        const allMotorcycles = motorcyclesData.map(moto => ({
          id: moto.id,
          label: moto.brand.value
        }));
        
        setMotorcycles(allMotorcycles);
        setClients(filteredClients);
        setTrials(trialsData);

        if (mode === 'edit' && defaultValues) {
          const currentMotorcycle = allMotorcycles.find(
            m => m.id === defaultValues.motorcycle_id
          );
          if (currentMotorcycle) {
            setAvailableMotorcycles([currentMotorcycle]);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        toast.error("Erreur lors du chargement des données");
        setLoading(false);
      }
    };

    fetchData();
  }, [mode, defaultValues]);

  const isMotorcycleAvailable = (motoId: string, startDate: Date, endDate: Date) => {
    if (mode === 'edit' && motoId === defaultValues?.motorcycle_id) {
      return true;
    }

    return !trials.some(trial => {
      if (trial.motorcycleId !== motoId) {
        return false;
      }

      if (mode === 'edit' && 
          trial.userId === defaultValues?.user_id && 
          trial.motorcycleId === defaultValues?.motorcycle_id) {
        return false;
      }

      const trialStart = formatDate(trial.startDate);
      const trialEnd = formatDate(trial.endDate);
      if (!trialStart || !trialEnd) return false;

      return startDate <= trialEnd && endDate >= trialStart;
    });
  };

  useEffect(() => {
    const startDate = form.getValues('start_date');
    const endDate = form.getValues('end_date');
    
    if (mode === 'create') {
      form.setValue('motorcycle_id', '');
    }
    
    if (startDate && endDate) {
      const available = motorcycles.filter(moto => 
        isMotorcycleAvailable(moto.id, startDate, endDate)
      );
      
      if (available.length === 0 && mode === 'create') {
        toast.info("Aucune moto n'est disponible pour cette période");
      }
      
      setAvailableMotorcycles(available);
    } else {
      setAvailableMotorcycles(mode === 'edit' ? motorcycles : []);
    }
  }, [form.watch('start_date'), form.watch('end_date'), motorcycles, trials, mode]);

  const handleSubmit = async (values: TrialFormValues) => {
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Une erreur est survenue");
      }
    }
  };

  if (loading) {
    return <div className="text-center">Chargement...</div>;
  }

  const displayFormattedDate = (date: Date | null | undefined) => {
    if (!date || !isValid(date)) return "Sélectionner une date";
    return format(date, "dd/MM/yyyy");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="user_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={mode === 'edit'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="start_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de début</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {displayFormattedDate(field.value)}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="end_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date de fin</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {displayFormattedDate(field.value)}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => 
                      date < new Date() || 
                      (form.getValues('start_date') && date <= form.getValues('start_date'))
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="motorcycle_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Moto</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={!form.getValues('start_date') || !form.getValues('end_date') || mode === 'edit'}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={
                      !form.getValues('start_date') || !form.getValues('end_date')
                        ? "Sélectionnez d'abord les dates"
                        : availableMotorcycles.length === 0
                        ? "Aucune moto disponible"
                        : "Sélectionner une moto"
                    } />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableMotorcycles.length > 0 ? (
                    availableMotorcycles.map((moto) => (
                      <SelectItem key={moto.id} value={moto.id}>
                        {moto.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-motorcycles" disabled>
                      {!form.getValues('start_date') || !form.getValues('end_date')
                        ? "Sélectionnez d'abord les dates"
                        : "Aucune moto disponible pour cette période"}
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {mode === "create" ? "Créer l'essai" : "Mettre à jour l'essai"}
        </Button>
      </form>
    </Form>
  );
}

export default AddTrialForm;