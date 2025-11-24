import Link from 'next/link';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-4 text-center'>
      <h1 className='text-6xl bg-gradient-to-br from-blue-600 to-purple-600 font-extrabold tracking-tighter pr-3 pb-6 text-transparent bg-clip-text'>
        404
      </h1>
      <h2 className='text-2xl font-semibold mb-4'>Page Not Found</h2>
      <p className='text-gray-600 mb-8'>
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <Link href='/'>
        <Button>Return Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
