import { getUserAccounts } from '@/actions/dashboard';
import React from 'react';
import AddTransactionForm from '../_components/add-transaction.form';
import { defaultCategories } from '@/data/categories';

const CreateTransaction = async () => {
  const accounts = await getUserAccounts();

  return (
    <div className='max-w-3xl mx-auto px-5'>
      <h1 className='text-5xl mb-8 bg-gradient-to-br from-blue-600 to-purple-600 font-bold tracking-tighter pr-3 pb-3 text-transparent bg-clip-text'>
        Add Transaction
      </h1>

      <AddTransactionForm accounts={accounts} categories={defaultCategories} />
    </div>
  );
};

export default CreateTransaction;
