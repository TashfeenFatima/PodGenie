import LeftSidebar from "@/components/LeftSidebar";
import MobileNav from "@/components/MobileNav";
import RightSidebar from "@/components/RightSidebar";
import Image from "next/image";
import { Toaster } from "@/components/ui/toaster";
import PodcastPlayer from "@/components/PodcastPlayer";
import Navbar from "@/components/Navbar";
import WhyPage from "@/components/Why";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-col">
      {/* Fixed Navbar at top spanning full width */}
      <Navbar />

      <main className="relative flex bg-black-3 pt-16">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Center Content */}
        <section className="flex min-h-screen flex-1 flex-col px-4 sm:px-14">
          <div className="mx-auto flex w-full max-w-5xl flex-col max-sm:px-4">
            {/* Mobile Nav */}
            <div className="flex h-16 items-center justify-between md:hidden">
              <Image 
                src="/icons/logo.svg"
                width={30}
                height={30}
                alt="menu icon"
              />
              <MobileNav />
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:pb-14">
              <Toaster />
              {children}
            </div>
          </div>
        </section>
    
        {/* Right Sidebar */}
        <RightSidebar />
      </main>

      {/* Podcast Player */}
      <PodcastPlayer />
    </div>
  );
}
