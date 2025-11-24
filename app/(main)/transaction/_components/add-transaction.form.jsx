'use client';

import { createTransaction } from '@/actions/transactions';
import { transactionSchema } from '@/app/lib/schema';
import CreateAccountDrawer from '@/components/create-account-drawer';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { defaultCategories } from '@/data/categories';
import useFetch from '@/hooks/use-fetch';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import ReceiptScanner from './receipt-scanner';

const AddTransactionForm = ({ accounts }) => {
  const router = useRouter();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'EXPENSE',
      amount: '',
      description: '',
      accountId: accounts.find((account) => account.isDefault)?.id,
      date: new Date(),
      isRecurring: false,
    },
  });

  const {
    data: transactionData,
    loading: isLoading,
    fn: createTransactionFn,
    error,
  } = useFetch(createTransaction);

  const type = watch('type');
  const isRecurring = watch('isRecurring');
  const date = watch('date');

  const filteredCategories = defaultCategories.filter(
    (category) => category.type === type
  );

  const onSubmit = async (data) => {
    console.log(data);
    const formData = { ...data, amount: parseFloat(data.amount) };

    createTransactionFn(formData);
  };

  // useEffect(() => {
  //   if (transactionData?.success && !isLoading) {
  //     toast.success('Transaction created successfully');
  //     reset();
  //     router.push(`/account/${transactionData.data.accountId}`);
  //   }
  // }, [transactionData, isLoading]);

  const handleScanComplete = (scannedData) => {
    //
  };

  return (
    <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
      {/* AI Reciept Scanner */}
      <ReceiptScanner onScanComplete={handleScanComplete} />

      <div className='flex flex-col gap-2'>
        <label className='text-sm font-medium' htmlFor='type'>
          Type
        </label>
        <Select
          onValueChange={(value) => setValue('type', value)}
          defaultValue={type}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select type' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='EXPENSE'>Expense</SelectItem>
            <SelectItem value='INCOME'>Income</SelectItem>
          </SelectContent>
        </Select>

        {errors.type && (
          <p className='text-red-500 text-sm'>{errors.type.message}</p>
        )}
      </div>

      <div className='py-2 grid gap-6 md:grid-cols-2'>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium' htmlFor='type'>
            Amount
          </label>
          <Input
            type='number'
            step='0.01'
            placeholder='0.00'
            {...register('amount')}
          />

          {errors.amount && (
            <p className='text-red-500 text-sm'>{errors.amount.message}</p>
          )}
        </div>
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium' htmlFor='type'>
            Account
          </label>
          <Select
            onValueChange={(value) => setValue('accountId', value)}
            defaultValue={getValues('accountId')}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select account' />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} (${parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button
                  variant='ghost'
                  className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground'
                >
                  Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>

          {errors.accountId && (
            <p className='text-red-500 text-sm'>{errors.accountId.message}</p>
          )}
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-sm font-medium' htmlFor='category'>
          Category
        </label>
        <Select
          onValueChange={(value) => setValue('category', value)}
          defaultValue={getValues('category')}
        >
          <SelectTrigger>
            <SelectValue placeholder='Select category' />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.category && (
          <p className='text-red-500 text-sm'>{errors.category.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-sm font-medium' htmlFor='date'>
          Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant='outline'>
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
              <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode='single'
              selected={date}
              onSelect={(date) => setValue('date', date)}
              disabled={(date) =>
                date > new Date() || date < new Date('1900-01-01')
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {errors.date && (
          <p className='text-red-500 text-sm'>{errors.date.message}</p>
        )}
      </div>

      <div className='flex flex-col gap-2'>
        <label className='text-sm font-medium' htmlFor='date'>
          Description
        </label>
        <Input placeholder='Enter description' {...register('description')} />

        {errors.description && (
          <p className='text-red-500 text-sm'>{errors.description.message}</p>
        )}
      </div>

      <div className='flex items-center justify-between rounded-lg border p-3 gap-0.5 mt-4'>
        <div>
          <label
            htmlFor='isRecurring'
            className='text-sm font-medium cursor-pointer'
          >
            Recurring Transaction
          </label>
          <p className='text-sm text-muted-foreground'>
            Set up a recurring schedule for this transaction
          </p>
        </div>

        <Switch
          onCheckedChange={(checked) => setValue('isRecurring', checked)}
          checked={isRecurring}
        />
        {errors.isDefault && (
          <p className='text-red-500 text-sm'>{errors.isDefault.message}</p>
        )}
      </div>

      {isRecurring && (
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium' htmlFor='recurringInterval'>
            Recurring Interval
          </label>
          <Select
            onValueChange={(value) => setValue('recurringInterval', value)}
            defaultValue={getValues('recurringInterval')}
          >
            <SelectTrigger>
              <SelectValue placeholder='Select Interval' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='DAILY'>Daily</SelectItem>
              <SelectItem value='WEEKLY'>Weekly</SelectItem>
              <SelectItem value='MONTHLY'>Monthly</SelectItem>
              <SelectItem value='YEARLY'>Yearly</SelectItem>
            </SelectContent>
          </Select>

          {errors.recurringInterval && (
            <p className='text-red-500 text-sm'>
              {errors.recurringInterval.message}
            </p>
          )}
        </div>
      )}

      <div className='flex gap-4'>
        <Button
          type='button'
          variant='outline'
          className='w-1/2'
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type='submit' className='w-1/2' disabled={isLoading}>
          Create Transaction
        </Button>
      </div>
    </form>
  );
};

export default AddTransactionForm;
