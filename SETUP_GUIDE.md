# Quick Setup Guide

## 🚀 Quick Start (3 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Your Images
- Place 6 hero images in the `/public` folder
- Name them: `hero1.jpg`, `hero2.jpg`, `hero3.jpg`, `hero4.jpg`, `hero5.jpg`, `hero6.jpg`
- See `/public/IMAGES_README.txt` for detailed image requirements

### 3. Start Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your website!

---

## 📝 Customization Checklist

### Update Branding
- [ ] Replace "PIXEL" logo in `components/navigation.tsx`
- [ ] Update site title in `app/layout.tsx`
- [ ] Update metadata description in `app/layout.tsx`

### Update Content
- [ ] Add your images to `/public` folder
- [ ] Update section titles in `app/page.tsx`
- [ ] Update footer contact info in `components/footer.tsx`
- [ ] Update footer links in `components/footer.tsx`
- [ ] Update social media links in `components/footer.tsx`

### Optional Customizations
- [ ] Adjust overlay opacity for each section
- [ ] Modify color scheme in `app/globals.css`
- [ ] Add more sections or pages
- [ ] Customize navigation menu items

---

## 🎨 Design Sections

Your homepage includes these sections (modify in `app/page.tsx`):

1. **Engagement & Weddings** - Main hero section
2. **Weddings** - Traditional wedding photography
3. **Cinematic Pre-Wedding Shoots** - Destination pre-wedding shoots
4. **Concept x Creativity** - Artistic photography
5. **Lifestyle** - Beach/lifestyle photography
6. **Celebrations** - Close-up celebration moments

---

## 🛠️ Common Tasks

### Change Section Title
```tsx
<HeroSection
  title="Your New Title"  // ← Change this
  subtitle="Your subtitle"
  // ... rest of props
/>
```

### Adjust Image Darkness
```tsx
<HeroSection
  // ...
  overlayOpacity={0.5}  // ← 0 = bright, 1 = very dark
/>
```

### Add New Navigation Link
In `components/navigation.tsx`:
```tsx
const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Your New Page', href: '/new-page' },  // ← Add here
  // ...
];
```

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## 🚢 Deploy

### Deploy to Vercel (Easiest)
1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy!

Or use CLI:
```bash
npx vercel
```

---

## ❓ Need Help?

- Check the main `README.md` for detailed documentation
- Review the component files for inline comments
- Check Next.js docs: [nextjs.org/docs](https://nextjs.org/docs)
- Check Tailwind docs: [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

Good luck with your photography website! 📸✨
