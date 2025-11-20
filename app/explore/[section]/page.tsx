import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMediaUrl } from '@/lib/media-url';

// Define the section configurations
const sectionConfigs: Record<string, {
  title: string;
  description: string;
  imageFolder: string;
  videoFolder: string;
}> = {
  'authentic-love-stories': {
    title: 'AUTHENTIC X LOVE STORIES 2024',
    description: 'We specialize in crafting innovative and authentic moments, transforming them into timeless memories, with a perfect blend of creativity and passion, we deliver experiences that are as unique as your story. At the heart of our premium photography lies a commitment to capturing emotions that last forever.',
    imageFolder: 'firstsection',
    videoFolder: 'firstSection',
  },
  'weddings': {
    title: 'WEDDINGS 2024',
    description: 'We specialize in crafting innovative and authentic moments, transforming them into timeless memories, with a perfect blend of creativity and passion, we deliver experiences that are as unique as your story. At the heart of our premium photography lies a commitment to capturing emotions that last forever.',
    imageFolder: 'firstsection',
    videoFolder: 'firstSection',
  },
  'pre-wedding': {
    title: 'CINEMATIC PRE-WEDDING SHOOTS 2024',
    description: 'We specialize in crafting innovative and authentic moments, transforming them into timeless memories, with a perfect blend of creativity and passion, we deliver experiences that are as unique as your story. At the heart of our premium photography lies a commitment to capturing emotions that last forever.',
    imageFolder: 'secondSection',
    videoFolder: 'firstSection',
  },
  'concept-creativity': {
    title: 'CONCEPT X CREATIVITY 2024',
    description: 'We specialize in crafting innovative and authentic moments, transforming them into timeless memories, with a perfect blend of creativity and passion, we deliver experiences that are as unique as your story. At the heart of our premium photography lies a commitment to capturing emotions that last forever.',
    imageFolder: 'secondSection',
    videoFolder: 'firstSection',
  },
  'lifestyle': {
    title: 'LIFESTYLE 2024',
    description: 'We specialize in crafting innovative and authentic moments, transforming them into timeless memories, with a perfect blend of creativity and passion, we deliver experiences that are as unique as your story. At the heart of our premium photography lies a commitment to capturing emotions that last forever.',
    imageFolder: 'thirssection',
    videoFolder: 'firstSection',
  },
  'celebrations': {
    title: 'CELEBRATIONS 2024',
    description: 'We specialize in crafting innovative and authentic moments, transforming them into timeless memories, with a perfect blend of creativity and passion, we deliver experiences that are as unique as your story. At the heart of our premium photography lies a commitment to capturing emotions that last forever.',
    imageFolder: 'thirssection',
    videoFolder: 'firstSection',
  },
};

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to get images from a folder (randomized)
function getImagesFromFolder(folder: string): string[] {
  // This would be replaced with actual file system reading in production
  // For now, returning placeholder paths
  const fs = require('fs');
  const path = require('path');

  try {
    const folderPath = path.join(process.cwd(), 'public', 'Image', folder);
    const files = fs.readdirSync(folderPath);
    const imageFiles = files
      .filter((file: string) => /\.(jpg|jpeg|png|webp)$/i.test(file))
      .map((file: string) => getMediaUrl(`Image/${folder}/${file}`));

    // Randomize the images
    return shuffleArray(imageFiles);
  } catch (error) {
    return [];
  }
}

// Helper function to get all videos from folder (randomized)
function getVideosFromFolder(folder: string): string[] {
  const fs = require('fs');
  const path = require('path');

  try {
    const folderPath = path.join(process.cwd(), 'public', 'video', folder);
    const files = fs.readdirSync(folderPath);
    const videoFiles = files
      .filter((file: string) => /\.(mp4|webm|mov)$/i.test(file))
      .map((file: string) => getMediaUrl(`video/${folder}/${file}`));

    // Randomize the videos
    return shuffleArray(videoFiles);
  } catch (error) {
    return [];
  }
}

// Helper function to get a specific video based on section hash
function getVideoForSection(folder: string, section: string): string | null {
  const videos = getVideosFromFolder(folder);
  if (videos.length === 0) return null;

  // Use section name to consistently select a video for each explore page
  const hash = section.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % videos.length;

  return videos[index];
}

export default async function ExplorePage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  const config = sectionConfigs[section];

  if (!config) {
    notFound();
  }

  const images = getImagesFromFolder(config.imageFolder);
  const video = getVideoForSection(config.videoFolder, section);
  const allVideos = getVideosFromFolder(config.videoFolder);
  const autoplayVideo = allVideos[0] || null; // First video for autoplay section

  // Select specific images for the layout
  const heroImage = images[0] || '/placeholder.jpg';
  const twoImages = images.slice(1, 3);
  const detailImage = images[3] || images[0];
  const gridImages = images.slice(4, 10); // 6 images for the grid

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Image Section */}
      <section className="relative w-full h-[70vh] md:h-screen">
        <Image
          src={heroImage}
          alt={config.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-light tracking-[0.15em] md:tracking-[0.3em] uppercase text-white text-center px-4">
            {config.title}
          </h1>
        </div>
      </section>

      {/* Autoplay Muted Video Section */}
      {autoplayVideo && (
        <section className="relative w-full h-[70vh] md:h-screen">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={autoplayVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </section>
      )}

      {/* Description Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm md:text-base leading-relaxed text-gray-700">
            {config.description}
          </p>
        </div>
      </section>

      {/* Two Images Side by Side */}
      {twoImages.length >= 2 && (
        <section className="px-4 pb-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {twoImages.map((img, idx) => (
              <div key={idx} className="relative aspect-[3/4]">
                <Image
                  src={img}
                  alt={`${config.title} ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Single Detail Image */}
      <section className="px-4 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative aspect-[4/5]">
            <Image
              src={detailImage}
              alt={`${config.title} detail`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Video/Reel Section */}
      {video && (
        <section className="px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative aspect-[9/16] md:aspect-video bg-black">
              <video
                controls
                className="w-full h-full object-contain"
                preload="metadata"
              >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>
      )}

      {/* Six Images in 2 Column Grid */}
      {gridImages.length > 0 && (
        <section className="px-4 pb-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            {gridImages.map((img, idx) => (
              <div key={idx} className="relative aspect-[3/4]">
                <Image
                  src={img}
                  alt={`${config.title} gallery ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

export async function generateStaticParams() {
  return Object.keys(sectionConfigs).map((section) => ({
    section,
  }));
}
