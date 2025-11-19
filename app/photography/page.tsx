import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';
import Image from 'next/image';

// Helper function to shuffle an array
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to get all images from all folders
function getAllImages(): string[] {
  const fs = require('fs');
  const path = require('path');

  const folders = ['firatSection', 'secondSection', 'thirdSection'];
  let allImages: string[] = [];

  folders.forEach((folder) => {
    try {
      const folderPath = path.join(process.cwd(), 'public', 'Image', folder);
      const files = fs.readdirSync(folderPath);
      const imageFiles = files
        .filter((file: string) => /\.(jpg|jpeg|png|webp)$/i.test(file))
        .map((file: string) => `/Image/${folder}/${file}`);
      allImages = [...allImages, ...imageFiles];
    } catch (error) {
      // Folder doesn't exist or can't be read
    }
  });

  // Randomize all images
  return shuffleArray(allImages);
}

export default function PhotographyPage() {
  const images = getAllImages();
  const heroImage = images[0] || '/Image/DSC_2944.jpg'; // First image for hero section

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section with Featured Image */}
      <section className="relative w-full h-[70vh] md:h-screen">
        <Image
          src={heroImage}
          alt="Photography"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.2em] md:tracking-[0.3em] uppercase text-white text-center px-4">
            Photography
          </h1>
        </div>
      </section>

      {/* Description */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm md:text-base leading-relaxed text-gray-700">
            Explore our collection of timeless moments captured through the lens. Each photograph tells a unique story,
            preserving memories that last forever.
          </p>
        </div>
      </section>

      {/* Photo Gallery - Masonry Style */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
            {images.map((img, idx) => (
              <div key={idx} className="break-inside-avoid">
                <div className="relative w-full aspect-[3/4] mb-4">
                  <Image
                    src={img}
                    alt={`Photography ${idx + 1}`}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
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
