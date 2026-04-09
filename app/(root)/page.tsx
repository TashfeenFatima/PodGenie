"use client";

import PodcastCard from "@/components/PodcastCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LoaderSpinner from "@/components/LoaderSpinner";
import { motion } from "framer-motion";

export default function Home() {
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts) ?? [];

  return (
    <main className="relative min-h-screen w-full bg-black text-white-1">
      {/* Hero Section */}
      <section className="relative z-10 px-6 sm:px-10 lg:px-24 max-w-[1440px] mx-auto pt-24 pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-6xl font-extrabold  drop-shadow-md"
        >
          Turn Your Ideas into Podcasts, <span className="text-transparent bg-clip-text bg-orange-500 ">Instantly.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-4 text-lg sm:text-xl text-white-3 max-w-2xl mx-auto"
        >
          Create. Discover. Listen. All in One Place.
        </motion.p>
      </section>

      {/* Podcast Cards Grid */}
      <section className="relative z-10 px-6 sm:px-10 lg:px-24 max-w-[1400px] mx-auto w-full">
        {trendingPodcasts.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <LoaderSpinner size="lg" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 mt-10"
          >
            {trendingPodcasts.map(
              ({ _id, podcastTitle, podcastDescription, imageUrl }) => (
                <motion.div
                  key={_id}
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 250 }}
                  className="bg-[#1a1a1a] rounded-2xl shadow-md hover:shadow-orange-400/30 transition-shadow duration-300 p-4"
                >
                  <PodcastCard
                    imgUrl={imageUrl as string}
                    title={podcastTitle}
                    description={podcastDescription}
                    podcastId={_id}
                  />
                </motion.div>
              )
            )}
          </motion.div>
        )}
      </section>
    </main>
  );
}
