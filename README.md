# Photography Website - Pixel

A modern, elegant photography website built with Next.js 15, TypeScript, and Tailwind CSS. This project features a beautiful homepage design with full-screen hero sections perfect for showcasing photography work.

## Features

- ✨ Modern and elegant design
- 📱 Fully responsive layout
- 🎨 Full-screen hero sections with overlay text
- 🖼️ Image optimization with Next.js Image component
- 🎯 TypeScript for type safety
- 💅 Styled with Tailwind CSS and Shadcn UI components
- 🚀 Fast page loads with Next.js App Router

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Font**: Geist Sans & Geist Mono

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Adding Your Images

Replace the placeholder images in the `/public` directory with your own images:

- `hero1.jpg` - Engagement & Weddings section (recommended: 1920x1080px)
- `hero2.jpg` - Weddings section (recommended: 1920x1080px)
- `hero3.jpg` - Cinematic Pre-Wedding Shoots section (recommended: 1920x1080px)
- `hero4.jpg` - Concept x Creativity section (recommended: 1920x1080px)
- `hero5.jpg` - Lifestyle section (recommended: 1920x1080px)
- `hero6.jpg` - Celebrations section (recommended: 1920x1080px)

### Image Guidelines

- **Format**: JPG or WebP for best performance
- **Size**: 1920x1080px (Full HD) or higher
- **Aspect Ratio**: 16:9 recommended
- **File Size**: Optimize images to be under 500KB for better loading times
- Use tools like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/) to compress images

## Project Structure

```
photography-website/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Homepage with hero sections
│   └── globals.css         # Global styles and Tailwind config
├── components/
│   ├── hero-section.tsx    # Reusable hero section component
│   ├── navigation.tsx      # Header navigation
│   └── footer.tsx          # Footer component
├── public/                 # Static assets (images, videos)
└── README.md
```

## Customization

### Update Logo

Replace "PIXEL" in `components/navigation.tsx` with your logo:

```tsx
<Link href="/" className="flex items-center">
  <Image src="/logo.png" alt="Your Logo" width={120} height={40} />
</Link>
```

### Modify Hero Sections

Edit the hero sections in `app/page.tsx`:

```tsx
<HeroSection
  title="Your Title"
  subtitle="Your subtitle"
  backgroundImage="/your-image.jpg"
  overlayOpacity={0.3}  // 0-1 for darkness
  textColor="light"     // 'light' or 'dark'
  height="h-screen"     // Tailwind height class
/>
```

### Update Contact Information

Edit footer details in `components/footer.tsx`:

```tsx
<p>+91 00000 00000</p>      // Your phone
<p>info@pixel.com</p>       // Your email
<p>Address Line 1</p>       // Your address
```

### Color Scheme

Modify colors in `app/globals.css` to match your brand.

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This website can be easily deployed to:

- **Vercel** (recommended): `npx vercel`
- **Netlify**: Connect your Git repository
- **AWS/Google Cloud/Azure**: Build and deploy the `.next` folder

## Performance Tips

1. Optimize all images before uploading
2. Use WebP format for better compression
3. Enable lazy loading for images below the fold
4. Consider using a CDN for image delivery
5. Enable caching for static assets

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

Built with ❤️ using Next.js and Tailwind CSS
