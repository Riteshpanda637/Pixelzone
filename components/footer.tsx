import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

export function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section - Tagline */}
        <div className="text-center mb-12">
          <p className="text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] uppercase text-gray-400">
            Creating timeless memories with artistry and elegance by bringing memories alive through storytelling imagery via picture capturing and film
          </p>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Contact Column */}
          <div>
            <h3 className="text-sm tracking-wider uppercase mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-gray-400">
              <a href="https://wa.me/917735037699" className="block hover:text-white transition-colors">
                +91 7735037699
              </a>
              {/* <a href="mailto:info@pixelzone.in" className="block hover:text-white transition-colors">
                info@pixelzone.in
              </a> */}
              <a
                href="https://maps.google.com/?q=19.302666,84.796173"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition-colors"
              >
                Ram Nagar, infront of Nandan convention, Hillpatna
              </a>
            </div>
          </div>

          {/* Links Column */}
          <div>
            <h3 className="text-sm tracking-wider uppercase mb-4">Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/photography" className="block text-gray-400 hover:text-white transition-colors">
                Photography
              </Link>
              <Link href="/films" className="block text-gray-400 hover:text-white transition-colors">
                Films
              </Link>
              <Link href="/connect" className="block text-gray-400 hover:text-white transition-colors">
                Connect
              </Link>
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h3 className="text-sm tracking-wider uppercase mb-4">Explore</h3>
            <div className="space-y-2 text-sm">
              <Link href="/explore/authentic-love-stories" className="block text-gray-400 hover:text-white transition-colors">
                Love Stories
              </Link>
              <Link href="/explore/weddings" className="block text-gray-400 hover:text-white transition-colors">
                Weddings
              </Link>
              <Link href="/explore/pre-wedding" className="block text-gray-400 hover:text-white transition-colors">
                Pre-Wedding
              </Link>
              <Link href="/explore/lifestyle" className="block text-gray-400 hover:text-white transition-colors">
                Lifestyle
              </Link>
            </div>
          </div>

          {/* Social Column */}
          <div>
            <h3 className="text-sm tracking-wider uppercase mb-4">Follow Us</h3>
            <div className="space-y-2 text-sm">
              <a
                href="https://www.instagram.com/pixelzone.in?igsh=MWp2aDVwZTZoYW1ncQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Instagram
              </a>
              <a
                href="https://wa.me/917735037699"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-8">
          <a
            href="https://www.instagram.com/pixelzone.in?igsh=MWp2aDVwZTZoYW1ncQ%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://wa.me/917735037699"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="WhatsApp"
          >
            <FaWhatsapp size={24} />
          </a>
        </div>

        {/* Bottom Copyright */}
        <div className="text-center border-t border-gray-800 pt-8">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Pixelzone. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
