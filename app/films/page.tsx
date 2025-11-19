import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

// Helper function to get all videos
function getAllVideos(): string[] {
  const fs = require('fs');
  const path = require('path');

  let allVideos: string[] = [];

  try {
    // Get videos from firstSection folder
    const folderPath = path.join(process.cwd(), 'public', 'video', 'firstSection');
    const files = fs.readdirSync(folderPath);
    const videoFiles = files
      .filter((file: string) => /\.(mp4|webm|mov)$/i.test(file))
      .map((file: string) => `/video/firstSection/${file}`);
    allVideos = [...allVideos, ...videoFiles];
  } catch (error) {
    // Folder doesn't exist or can't be read
  }

  try {
    // Get videos from root video folder
    const rootFolderPath = path.join(process.cwd(), 'public', 'video');
    const files = fs.readdirSync(rootFolderPath);
    const videoFiles = files
      .filter((file: string) => {
        const filePath = path.join(rootFolderPath, file);
        return /\.(mp4|webm|mov)$/i.test(file) && !fs.statSync(filePath).isDirectory();
      })
      .map((file: string) => `/video/${file}`);
    allVideos = [...allVideos, ...videoFiles];
  } catch (error) {
    // Folder doesn't exist or can't be read
  }

  return allVideos;
}

export default function FilmsPage() {
  const videos = getAllVideos();
  const heroVideo = videos[0] || '/video/web.mp4'; // First video for hero section

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section with Autoplay Video */}
      <section className="relative w-full h-[70vh] md:h-screen">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] md:tracking-[0.3em] uppercase text-white text-center px-4">
            Films
          </h1>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm md:text-base leading-relaxed text-gray-700">
            Cinematic stories that capture the essence of your special moments. Each film is crafted with passion and
            artistry to create memories that come alive.
          </p>
        </div>
      </section>

      {/* Video Gallery */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {videos.map((video, idx) => (
              <div key={idx} className="relative">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <video
                    controls
                    className="w-full h-full object-contain"
                    preload="metadata"
                  >
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    {video.split('/').pop()?.replace(/\.(mp4|webm|mov)$/i, '')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
