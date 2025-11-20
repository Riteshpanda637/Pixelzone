const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const QUALITY = 80; // Quality for JPEG compression (1-100, 80 is good balance)
const MAX_WIDTH = 2400; // Maximum width in pixels (maintains aspect ratio)
const MAX_HEIGHT = 3600; // Maximum height in pixels

// Function to compress a single image
async function compressImage(inputPath, outputPath) {
  try {
    const stats = fs.statSync(inputPath);
    const originalSize = stats.size;

    // Get image metadata
    const metadata = await sharp(inputPath).metadata();

    // Resize if image is too large, maintain aspect ratio
    let transform = sharp(inputPath);

    if (metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT) {
      transform = transform.resize(MAX_WIDTH, MAX_HEIGHT, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }

    // Compress based on format
    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      transform = transform.jpeg({ quality: QUALITY, progressive: true, mozjpeg: true });
    } else if (metadata.format === 'png') {
      transform = transform.png({ quality: QUALITY, compressionLevel: 9 });
    } else if (metadata.format === 'webp') {
      transform = transform.webp({ quality: QUALITY });
    }

    await transform.toFile(outputPath);

    const newStats = fs.statSync(outputPath);
    const newSize = newStats.size;
    const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);

    return {
      success: true,
      originalSize,
      newSize,
      reduction,
      fileName: path.basename(inputPath)
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      fileName: path.basename(inputPath)
    };
  }
}

// Main function to compress root-level images
async function compressRootImages() {
  console.log('\n=== Compressing Root-Level Images ===\n');

  const imageFolder = path.join(__dirname, '..', 'public', 'Image');
  const compressedFolder = path.join(imageFolder, 'root_compressed');

  // Create compressed folder
  if (!fs.existsSync(compressedFolder)) {
    fs.mkdirSync(compressedFolder, { recursive: true });
  }

  // Find all root-level images (excluding subdirectories)
  const allFiles = fs.readdirSync(imageFolder);
  const imageFiles = allFiles.filter(file => {
    const fullPath = path.join(imageFolder, file);
    const isFile = fs.statSync(fullPath).isFile();
    const isImage = /\.(jpg|jpeg|png|webp)$/i.test(file);
    return isFile && isImage && file !== '.DS_Store';
  });

  console.log(`Found ${imageFiles.length} root-level images to compress\n`);

  let totalOriginalSize = 0;
  let totalNewSize = 0;
  let successCount = 0;
  let failCount = 0;

  for (const file of imageFiles) {
    const inputPath = path.join(imageFolder, file);
    const outputPath = path.join(compressedFolder, file);

    const result = await compressImage(inputPath, outputPath);

    if (result.success) {
      totalOriginalSize += result.originalSize;
      totalNewSize += result.newSize;
      successCount++;
      console.log(`✓ ${result.fileName}: ${(result.originalSize / 1024 / 1024).toFixed(2)}MB → ${(result.newSize / 1024 / 1024).toFixed(2)}MB (${result.reduction}% reduction)`);
    } else {
      failCount++;
      console.log(`✗ ${result.fileName}: ${result.error}`);
    }
  }

  const totalReduction = totalOriginalSize > 0 ? ((totalOriginalSize - totalNewSize) / totalOriginalSize * 100).toFixed(1) : 0;

  console.log('\n=== Summary ===');
  console.log(`✓ Compressed: ${successCount}`);
  console.log(`✗ Failed: ${failCount}`);
  console.log(`Original Size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`New Size: ${(totalNewSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total Reduction: ${totalReduction}%`);
  console.log(`\nCompressed images saved to: ${compressedFolder}`);
}

compressRootImages().catch(console.error);
