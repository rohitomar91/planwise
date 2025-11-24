import React, { Suspense } from 'react';
import DashboardPage from './page';
import { BarLoader } from 'react-spinners';

const DashboardLayout = ({ children }) => {
  return (
    <div className='px-5'>
      <h1 className='text-6xl mb-5 bg-gradient-to-br from-blue-600 to-purple-600 font-bold tracking-tighter pr-3 pb-3 text-transparent bg-clip-text'>
        Dashboard
      </h1>

      {/* Dashboard Page */}
      <Suspense
        fallback={<BarLoader className='mt-4' color='#9333EA' width={'100%'} />}
      >
        <DashboardPage />
      </Suspense>
    </div>
  );
};

export default DashboardLayout;
