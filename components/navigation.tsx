'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { getMediaUrl } from '@/lib/media-url';

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const navLinks = [
    { name: 'Photography', href: '/photography' },
    { name: 'Films', href: '/films' },
    { name: 'Connect', href: '/connect' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-transparent transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={getMediaUrl('Image/pixelLogo.png')}
              alt="Logo"
              width={300}
              height={200}
              className="object-contain w-32 h-auto md:w-48 lg:w-64"
              priority
            />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm tracking-wider text-white hover:text-gray-300 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Social Icons + Button */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Social Icons */}
            <Link
              href="https://www.instagram.com/pixelzone.in?igsh=MWp2aDVwZTZoYW1ncQ%3D%3D&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <FaInstagram size={24} />
            </Link>
            <Link
              href="https://wa.me/917735037699"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 transition-colors"
            >
              <FaWhatsapp size={24} />
            </Link>

            {/* Get In Touch Button */}
            <Link
              href="/connect"
              className="ml-4 px-6 py-2 bg-black text-white text-sm tracking-wider hover:bg-gray-800 transition-all duration-300 rounded-sm"
            >
              Get In Touch
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block text-sm tracking-wider text-black hover:text-gray-700"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Social Icons in Mobile */}
            <div className="flex items-center space-x-4 py-4">
              <Link
                href="https://www.instagram.com/pixelzone.in?igsh=MWp2aDVwZTZoYW1ncQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-600"
              >
                <FaInstagram size={24} />
              </Link>
              <Link
                href="https://wa.me/917735037699"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black hover:text-gray-600"
              >
                <FaWhatsapp size={24} />
              </Link>
            </div>

            <Link
              href="/connect"
              className="block w-full text-center px-6 py-2 bg-black text-white text-sm tracking-wider"
              onClick={() => setIsOpen(false)}
            >
              Get In Touch
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
