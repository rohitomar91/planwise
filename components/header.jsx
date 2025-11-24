import React from 'react';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './ui/button';
import { LayoutDashboard, PenBox } from 'lucide-react';
import { checkUser } from '@/lib/checkUser';

const Header = async () => {
  await checkUser();

  return (
    <div className='top-0 fixed w-full bg-white/80 backdrop-blur-md z-50 border-b'>
      <nav className='container mx-auto p-4 flex items-center justify-between'>
        <Link href='/'>
          <Image
            src={'/plan-wise.svg'}
            alt='plan-wise logo'
            height={80}
            width={250}
            className='h-16 w-auto object-contain'
          />
        </Link>

        <div className='flex items-center space-x-4'>
          <SignedIn>
            <Link
              href='/dashboard'
              className='text-gray-600 hover:text-blue-600 flex items-center gap-2'
            >
              <Button variant='outline'>
                <LayoutDashboard size={18} />
                <span className='hidden md:inline'>Dashboard</span>
              </Button>
            </Link>
            <Link
              href='/transaction/create'
              className='text-gray-600 hover:text-blue-600 '
            >
              <Button className='flex items-center gap-2'>
                <PenBox size={18} />
                <span className='hidden md:inline'>Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl='/dashboard'>
              <Button variant='outline'>Sign In</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'h-12 w-12',
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </div>
  );
};

export default Header;
