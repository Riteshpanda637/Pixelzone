const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Disable SSL certificate verification for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: 'S0SB3ZZ7QX85RSINCT7E',
  secretAccessKey: 'GwAKAbvZbyzy53TzU8fXVqR6kFTSwVejMcNLZnuG',
  region: 'in-maa-1',
  endpoint: 'https://dev.objectstore.mybeworld.com',
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
  httpOptions: {
    agent: new https.Agent({
      rejectUnauthorized: false
    })
  }
});

const BUCKET_NAME = 'pixel';

// Function to upload a file
async function uploadFile(filePath, s3Key) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const fileExt = path.extname(filePath).toLowerCase();

    // Determine content type
    let contentType = 'application/octet-stream';
    if (['.mp4', '.mov', '.webm'].includes(fileExt)) {
      contentType = 'video/mp4';
    } else if (['.jpg', '.jpeg'].includes(fileExt)) {
      contentType = 'image/jpeg';
    } else if (fileExt === '.png') {
      contentType = 'image/png';
    } else if (fileExt === '.webp') {
      contentType = 'image/webp';
    }

    const params = {
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: fileContent,
      ContentType: contentType,
      ACL: 'public-read'
    };

    console.log(`Uploading: ${fileName} (${(fileContent.length / 1024 / 1024).toFixed(2)} MB)`);

    const result = await s3.upload(params).promise();
    console.log(`✓ Uploaded: ${s3Key}`);
    return result.Location;
  } catch (error) {
    console.error(`✗ Failed to upload ${filePath}:`, error.message);
    throw error;
  }
}

// Function to recursively get all files from a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    // Skip .DS_Store files
    if (file === '.DS_Store') return;

    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Main upload function
async function uploadAllMedia() {
  const publicPath = path.join(__dirname, '..', 'public');
  const videoPath = path.join(publicPath, 'video');
  const imagePath = path.join(publicPath, 'Image');

  console.log('\n=== Starting Media Upload to Object Storage ===\n');

  // Upload videos
  console.log('\n--- Uploading Videos ---\n');
  if (fs.existsSync(videoPath)) {
    const videoFiles = getAllFiles(videoPath);
    console.log(`Found ${videoFiles.length} video files\n`);

    for (const file of videoFiles) {
      const relativePath = path.relative(publicPath, file);
      const s3Key = relativePath.replace(/\\/g, '/');
      await uploadFile(file, s3Key);
    }
  }

  // Upload images
  console.log('\n--- Uploading Images ---\n');
  if (fs.existsSync(imagePath)) {
    const imageFiles = getAllFiles(imagePath);
    console.log(`Found ${imageFiles.length} image files\n`);

    for (const file of imageFiles) {
      const relativePath = path.relative(publicPath, file);
      // Normalize path separators to forward slashes for S3
      const s3Key = relativePath.replace(/\\/g, '/');
      await uploadFile(file, s3Key);
    }
  }

  // Also upload root level images
  console.log('\n--- Uploading Root Level Images ---\n');
  const rootImages = fs.readdirSync(imagePath).filter(file => {
    const fullPath = path.join(imagePath, file);
    return fs.statSync(fullPath).isFile() && /\.(jpg|jpeg|png|webp)$/i.test(file);
  });

  for (const file of rootImages) {
    const fullPath = path.join(imagePath, file);
    const relativePath = path.relative(publicPath, fullPath);
    const s3Key = relativePath.replace(/\\/g, '/');
    await uploadFile(fullPath, s3Key);
  }

  // Upload logo
  console.log('\n--- Uploading Logo ---\n');
  const logoPath = path.join(publicPath, 'image', 'pixelLogo.png');
  if (fs.existsSync(logoPath)) {
    await uploadFile(logoPath, 'image/pixelLogo.png');
  }

  console.log('\n=== Upload Complete! ===\n');
  console.log(`All media files are now available at: https://dev.objectstore.mybeworld.com/${BUCKET_NAME}/`);
}

// Run the upload
uploadAllMedia().catch(console.error);
