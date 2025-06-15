"use client";

import PodcastCard from "@/components/PodcastCard";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import LoaderSpinner from "@/components/LoaderSpinner";

export default function Home() {
  // 1. Default to empty array so `.map` is always safe
  const trendingPodcasts = useQuery(api.podcasts.getTrendingPodcasts) ?? [];

  // // 2. Early return with centered loader
  // if (trending.length === 0) {
  //   return (
  //     <div className="flex justify-center items-center h-full py-20">
  //       <LoaderSpinner size="lg" />
  //     </div>
  //   );
  // }

  return (
    <main className="mt-12 px-4 md:px-8 lg:px-16">
      <h1 className="text-3xl font-semibold text-white-1 mb-8">
        Trending Podcasts
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {trendingPodcasts?.map(({ _id, podcastTitle, podcastDescription, imageUrl }) => (
          <PodcastCard
            key={_id}
            imgUrl={imageUrl as string}
            title={podcastTitle}
            description={podcastDescription}
            podcastId={_id}
          />
        ))}
      </div>
    </main>
  );
}
