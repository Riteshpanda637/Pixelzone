import { HeroSection } from '@/components/hero-section';
import { Navigation } from '@/components/navigation';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Main Hero - Engagement & Weddings with Video */}
      <HeroSection
        title="Authentic x Love Stories"
        subtitle=""
        backgroundVideo="/video/web.mp4"
        overlayOpacity={0.3}
        textColor="light"
        height="h-screen"
        buttonText="EXPLORE"
        buttonLink="/explore/authentic-love-stories"
      />

      {/* Spacing Section with Quote */}
      <div className="py-10 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <p className="text-lg md:text-xl text-gray-800 italic description1">
            "Every frame is a timeless legacy waiting to be unveiled."
          </p>
        </div>
      </div>

      {/* Weddings Section */}
      <HeroSection
        title="Weddings"
        subtitle=""
        backgroundImage="/image/STR_9821-1.jpg"
        overlayOpacity={0.4}
        textColor="light"
        height="h-screen"
        buttonText="EXPLORE"
        buttonLink="/explore/weddings"
      />

      {/* Spacing Section with Quote */}
      <div className="py-8 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <p className="text-base md:text-lg text-gray-800 italic description1">
            "Creating timeless memories with artistry and elegance by bringing memories alive through storytelling imagery via picture capturing and films"
          </p>
        </div>
      </div>

      {/* Cinematic Pre-Wedding Shoots */}
      <HeroSection
        title="Cinematic Pre-Wedding Shoots"
        subtitle=""
        backgroundImage="/Image/DSC_2944.jpg"
        overlayOpacity={0.3}
        textColor="light"
        height="h-screen"
        buttonText="EXPLORE"
        buttonLink="/explore/pre-wedding"
      />

      {/* Spacing Section */}
      <div className="h-12 bg-white"></div>

      {/* Concept x Creativity */}
      <HeroSection
        title="Concept x Creativity"
        subtitle=""
        backgroundVideo="/video/4.mp4"
        overlayOpacity={0.4}
        textColor="light"
        height="h-screen"
        buttonText="EXPLORE"
        buttonLink="/explore/concept-creativity"
      />

      {/* Spacing Section */}
      <div className="h-12 bg-white"></div>

      {/* Beach/Lifestyle Section */}
      <HeroSection
        title="Lifestyle"
        subtitle=""
        backgroundImage="/Image/DSC_2358-1.jpg"
        overlayOpacity={0.2}
        textColor="light"
        height="h-screen"
        buttonText="EXPLORE"
        buttonLink="/explore/lifestyle"
      />

      {/* Spacing Section */}
      <div className="h-12 bg-white"></div>

      {/* Celebrations */}
      <HeroSection
        title="Celebrations"
        subtitle=""
        backgroundImage="/Image/DSC_3293-1.jpg"
        overlayOpacity={0.5}
        textColor="light"
        height="h-screen"
        buttonText="EXPLORE"
        buttonLink="/explore/celebrations"
      />

      <Footer />
    </div>
  );
}
