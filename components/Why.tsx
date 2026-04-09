'use client';

import { motion } from 'framer-motion';
import { FaMagic, FaChartBar, FaPodcast, FaRocket, FaSearch, FaGlobe } from 'react-icons/fa';

const features = [
  {
    title: 'AI-Powered Podcast Creation',
    icon: <FaMagic className="text-orange-500 text-3xl" />,
    description: 'Generate professional podcasts from plain text using our advanced AI voice models.',
  },
  {
    title: 'Instant Publishing',
    icon: <FaRocket className="text-orange-500 text-3xl" />,
    description: 'Upload and share your podcast on all major platforms in minutes.',
  },
  {
    title: 'Smart Discovery',
    icon: <FaSearch className="text-orange-500 text-3xl" />,
    description: 'Reach your ideal listeners through intelligent recommendation algorithms.',
  },
  {
    title: 'Analytics Dashboard',
    icon: <FaChartBar className="text-orange-500 text-3xl" />,
    description: 'Track plays, likes, and engagement to understand and grow your audience.',
  },
  {
    title: 'Global Reach',
    icon: <FaGlobe className="text-orange-500 text-3xl" />,
    description: 'Podcasts hosted on PodGenie are accessible across the globe with blazing speed.',
  },
  {
    title: 'All-in-One Platform',
    icon: <FaPodcast className="text-orange-500 text-3xl" />,
    description: 'Write, convert, design, publish, and manage — all from one dashboard.',
  },
];

export default function WhyPage() {
  return (
    <main className="mt-20 px-6 sm:px-10 lg:px-24 max-w-[1400px] mx-auto w-full text-white-1 bg-black min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300 mb-8 text-center"
      >
        Why PodGenie?
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-white-3 max-w-2xl mx-auto mb-12 text-lg"
      >
        Explore the standout features that make PodGenie your go-to platform for podcast creation,
        distribution, and discovery.
      </motion.p>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="bg-zinc-900 rounded-2xl p-6 shadow-md hover:shadow-orange-500/20 transition-all duration-300"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-white-3 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </section>
    </main>
  );
}
