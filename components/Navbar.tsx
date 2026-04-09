'use client';

import { Menu } from 'lucide-react';
import React, { useState } from 'react';
import LeftSidebar from './LeftSidebar';
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from './ui/button';

const Navbar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-16 bg-black-1/60 backdrop-blur-md  text-white-1 flex items-center justify-between px-4 shadow-md z-50 rounded-b-xl">
        <div className="flex items-center">
          <button onClick={() => setShowSidebar(!showSidebar)}>
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="ml-8 text-lg font-semibold">
            <span className="text-transparent font-extrabold bg-clip-text bg-orange-500">
              PodGenie
            </span>{' '}
            - AI Powered Podcast Creation & Discovery Platform
          </h1>
        </div>

        <div className="flex items-center gap-8 mr-10">
          <SignedOut>
            <Button asChild className="bg-orange-500 text-white-1 text-sm font-bold">
              <Link href="/sign-in">Log In</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Button
              onClick={() => signOut(() => router.push('/'))}
              className="bg-orange-500 text-white-1 text-sm font-semibold"
            >
              Log Out
            </Button>
          </SignedIn>
        </div>
      </header>

      <LeftSidebar showSidebar={showSidebar} />
    </>
  );
};

export default Navbar;
