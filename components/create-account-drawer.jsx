'use client';

import { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accountSchema } from '@/app/lib/schema';
import React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from './ui/button';
import useFetch from '@/hooks/use-fetch';
import { createAccount } from '@/actions/dashboard';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const CreateAccountDrawer = ({ children }) => {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: '',
      type: 'CURRENT',
      balance: '',
      isDefault: false,
    },
  });

  const {
    data: newAccount,
    error,
    fn: createAccountFn,
    loading: createAccountLoading,
  } = useFetch(createAccount);

  // For a successful account creation
  useEffect(() => {
    if (newAccount && !createAccountLoading) {
      toast.success('Account created successfully!');
      reset();
      setOpen(false);
    }
  }, [createAccountLoading, newAccount]);

  //   For any error while creating account
  useEffect(() => {
    if (error) {
      toast.error(error.message || 'Failed to create account');
    }
  }, [error]);

  const onSubmit = async (data) => {
    console.log(data);
    await createAccountFn(data);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Create New Account</DrawerTitle>
        </DrawerHeader>
        <div className='p-4'>
          <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
            <div className='space-y-2'>
              <label htmlFor='name' className='text-sm font-medium'>
                Account Name
              </label>
              <Input
                id='name'
                placeholder='e.g., Main Checking'
                {...register('name')}
              />
              {errors.name && (
                <p className='text-red-500 text-sm'>{errors.name.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <label htmlFor='type' className='text-sm font-medium'>
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue('type', value)}
                defaultValue={watch('type')}
              >
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Select Type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='CURRENT'>Current</SelectItem>
                  <SelectItem value='SAVINGS'>Savings</SelectItem>
                  <SelectItem value='LOAN'>Loan</SelectItem>
                  <SelectItem value='INVESTMENT'>Investment</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className='text-red-500 text-sm'>{errors.type.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <label htmlFor='balance' className='text-sm font-medium'>
                Initial Balance
              </label>
              <Input
                id='balance'
                type='number'
                step='0.01'
                placeholder='0.00'
                {...register('balance')}
              />
              {errors.balance && (
                <p className='text-red-500 text-sm'>{errors.balance.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <label
                  htmlFor='isDefault'
                  className='text-sm font-medium cursor-pointer'
                >
                  Set As Default:
                </label>
                <p className='text-gray-900 text-sm italic'>
                  ^This account will be selected by default for transactions
                </p>
              </div>

              <Switch
                id='isDefault'
                onCheckedChange={(checked) => setValue('isDefault', checked)}
                checked={watch('isDefault')}
              />
              {errors.isDefault && (
                <p className='text-red-500 text-sm'>
                  {errors.isDefault.message}
                </p>
              )}
            </div>
            <div className='flex gap-4 pt-4'>
              <DrawerClose asChild>
                <Button type='button' variant='outline' className='flex-1'>
                  Cancel
                </Button>
              </DrawerClose>

              <Button
                className='flex-1'
                type='submit'
                disabled={createAccountLoading}
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CreateAccountDrawer;
