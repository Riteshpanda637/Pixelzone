import React from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  overlayOpacity?: number;
  textColor?: 'light' | 'dark';
  height?: string;
  showButton?: boolean;
  buttonText?: string;
  buttonLink?: string;
}

export function HeroSection({
  title,
  subtitle,
  backgroundImage = '/placeholder.jpg',
  backgroundVideo,
  overlayOpacity = 0.4,
  textColor = 'light',
  height = 'h-screen',
  showButton = true,
  buttonText = 'EXPLORE',
  buttonLink = '#'
}: HeroSectionProps) {
  return (
    <section className={`relative w-full ${height} flex items-center justify-center overflow-hidden`}>
      {/* Background Video or Image */}
      {backgroundVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${backgroundImage})`,
          }}
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <h1
          className={`text-4xl md:text-5xl lg:text-6xl font-light tracking-[0.3em] uppercase mb-4 ${
            textColor === 'light' ? 'text-white' : 'text-gray-900'
          }`}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={`text-sm md:text-base tracking-[0.2em] uppercase mb-8 ${
              textColor === 'light' ? 'text-white/90' : 'text-gray-800'
            }`}
          >
            {subtitle}
          </p>
        )}
        {showButton && (
          <Link
            href={buttonLink}
            className={`inline-block px-8 py-3 border-2 text-sm tracking-[0.2em] uppercase transition-all duration-300 ${
              textColor === 'light'
                ? 'border-white text-white hover:bg-white hover:text-black'
                : 'border-black text-black hover:bg-black hover:text-white'
            }`}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </section>
  );
}
