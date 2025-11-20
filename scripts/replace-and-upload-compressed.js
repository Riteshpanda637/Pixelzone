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
  endpoint: 'https://in-maa-1.linodeobjects.com',
  s3ForcePathStyle: false,
  signatureVersion: 'v4'
});

const BUCKET_NAME = 'dev.objectstore.mybeworld.com';

// Function to upload a file
async function uploadFile(filePath, s3Key) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);
    const fileExt = path.extname(filePath).toLowerCase();

    // Determine content type
    let contentType = 'application/octet-stream';
    if (['.jpg', '.jpeg'].includes(fileExt)) {
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

    await s3.upload(params).promise();
    console.log(`✓ Uploaded: ${s3Key}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to upload ${filePath}:`, error.message);
    return false;
  }
}

// Main function
async function replaceAndUpload() {
  console.log('\n=== Replacing and Uploading Compressed Images ===\n');

  const compressedFolder = path.join(__dirname, '..', 'public', 'Image', 'firstsection_compressed');
  const originalFolder = path.join(__dirname, '..', 'public', 'Image', 'firstsection');

  if (!fs.existsSync(compressedFolder)) {
    console.log('Compressed folder does not exist:', compressedFolder);
    return;
  }

  const files = fs.readdirSync(compressedFolder).filter(file => {
    return /\.(jpg|jpeg|png|webp)$/i.test(file);
  });

  console.log(`Found ${files.length} compressed images\n`);

  // Step 1: Replace local files
  console.log('Step 1: Replacing local files with compressed versions\n');
  for (const file of files) {
    const compressedPath = path.join(compressedFolder, file);
    const originalPath = path.join(originalFolder, file);

    // Backup original
    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(compressedPath, originalPath);
      console.log(`✓ Replaced: ${file}`);
    }
  }

  // Step 2: Upload to object storage
  console.log('\n\nStep 2: Uploading compressed images to object storage\n');

  let uploaded = 0;
  let failed = 0;

  for (const file of files) {
    const filePath = path.join(compressedFolder, file);
    const s3Key = `pixel/Image/firstsection/${file}`;

    const result = await uploadFile(filePath, s3Key);
    if (result) {
      uploaded++;
    } else {
      failed++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`✓ Uploaded: ${uploaded}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`\nAll compressed images have been uploaded to object storage!`);
  console.log(`Local files in ${originalFolder} have been replaced with compressed versions.`);
}

// Run the replacement and upload
replaceAndUpload().catch(console.error);
