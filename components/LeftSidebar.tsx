'use client';

import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { SignedIn, SignedOut, useClerk } from '@clerk/nextjs';
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { Button } from './ui/button';
import { useAudio } from '@/providers/AudioProvider';

type Props = {
  showSidebar: boolean;
};

const LeftSidebar = ({ showSidebar }: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const { audio } = useAudio();

  return (
    <section
      className={cn(
       "fixed left-0 top-20 z-40 w-64 bg-dark-1/70 backdrop-blur-md border-r border-white/10 text-white-1 h-screen transition-transform duration-300 ease-in-out shadow-lg",

        showSidebar ? "translate-x-0" : "-translate-x-full",
        audio?.audioUrl ? "h-[calc(100vh-140px)]" : "h-full"
      )}
    >
      <nav className="flex flex-col gap-6 p-5">
        

        {sidebarLinks.map(({ route, label, imgURL }) => {
          const isActive = pathname === route || pathname.startsWith(`${route}/`);

          return (
            <Link
              href={route}
              key={label}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-md hover:bg-black-1",
                isActive && "bg-zinc-800 border-l-4 border-orange-500"
              )}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <span className="text-sm font-semibold">{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* <div className="mt-auto px-5 pb-5">
        <SignedOut>
          <Button asChild className="w-full bg-orange-500 text-white-1">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </SignedOut>
        <SignedIn>
          <Button
            className="w-full bg-orange-500 text-white-1"
            onClick={() => signOut(() => router.push('/'))}
          >
            Log Out
          </Button>
        </SignedIn>
      </div> */}
    </section>
  );
};

export default LeftSidebar;

