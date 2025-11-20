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

// Function to process all images in a folder
async function compressFolder(folderPath) {
  console.log(`\n=== Compressing Images in ${folderPath} ===\n`);

  if (!fs.existsSync(folderPath)) {
    console.log('Folder does not exist:', folderPath);
    return;
  }

  // Create compressed folder
  const compressedFolder = path.join(folderPath, '..', path.basename(folderPath) + '_compressed');
  if (!fs.existsSync(compressedFolder)) {
    fs.mkdirSync(compressedFolder, { recursive: true });
  }

  const files = fs.readdirSync(folderPath).filter(file => {
    return /\.(jpg|jpeg|png|webp)$/i.test(file) && file !== '.DS_Store';
  });

  console.log(`Found ${files.length} images to compress\n`);

  let totalOriginalSize = 0;
  let totalNewSize = 0;
  let successCount = 0;
  let failCount = 0;

  for (const file of files) {
    const inputPath = path.join(folderPath, file);
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

  const totalReduction = ((totalOriginalSize - totalNewSize) / totalOriginalSize * 100).toFixed(1);

  console.log(`\n=== Summary ===`);
  console.log(`✓ Compressed: ${successCount}`);
  console.log(`✗ Failed: ${failCount}`);
  console.log(`Original Size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`New Size: ${(totalNewSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total Reduction: ${totalReduction}%`);
  console.log(`\nCompressed images saved to: ${compressedFolder}`);
}

// Get folder path from command line or use default
const folderToCompress = process.argv[2] || path.join(__dirname, '..', 'public', 'Image', 'firstsection');

compressFolder(folderToCompress).catch(console.error);
