const fs = require('fs');
const path = require('path');

// Function to get all files from a directory
function getFilesFromDirectory(dirPath, extensions) {
  try {
    if (!fs.existsSync(dirPath)) {
      return [];
    }
    const files = fs.readdirSync(dirPath);
    return files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return extensions.includes(ext);
    });
  } catch (error) {
    console.error(`Error reading ${dirPath}:`, error.message);
    return [];
  }
}

// Generate manifest
function generateManifest() {
  const manifest = {
    images: {
      firstsection: getFilesFromDirectory(
        path.join(process.cwd(), 'public', 'Image', 'firstsection'),
        ['.jpg', '.jpeg', '.png', '.webp']
      ),
      secondSection: getFilesFromDirectory(
        path.join(process.cwd(), 'public', 'Image', 'secondSection'),
        ['.jpg', '.jpeg', '.png', '.webp']
      ),
      thirssection: getFilesFromDirectory(
        path.join(process.cwd(), 'public', 'Image', 'thirssection'),
        ['.jpg', '.jpeg', '.png', '.webp']
      ),
    },
    videos: {
      root: getFilesFromDirectory(
        path.join(process.cwd(), 'public', 'video'),
        ['.mp4', '.mov', '.webm', '.avi']
      ).filter(file => !file.includes('/')), // Only root level files
      firstSection: getFilesFromDirectory(
        path.join(process.cwd(), 'public', 'video', 'firstSection'),
        ['.mp4', '.mov', '.webm', '.avi']
      ),
    },
  };

  // Write manifest to lib folder
  const manifestPath = path.join(process.cwd(), 'lib', 'media-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log('\n=== Media Manifest Generated ===\n');
  console.log(`Images - firstsection: ${manifest.images.firstsection.length} files`);
  console.log(`Images - secondSection: ${manifest.images.secondSection.length} files`);
  console.log(`Images - thirssection: ${manifest.images.thirssection.length} files`);
  console.log(`Videos - root: ${manifest.videos.root.length} files`);
  console.log(`Videos - firstSection: ${manifest.videos.firstSection.length} files`);
  console.log(`\nManifest saved to: ${manifestPath}`);
}

// Run generation
generateManifest();
