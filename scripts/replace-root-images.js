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

// Function to delete an object
async function deleteObject(key) {
  try {
    await s3.deleteObject({
      Bucket: BUCKET_NAME,
      Key: key
    }).promise();
    console.log(`✓ Deleted: ${key}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to delete ${key}:`, error.message);
    return false;
  }
}

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
async function replaceRootImages() {
  console.log('\n=== Replacing Root-Level Images in Object Storage ===\n');

  const compressedFolder = path.join(__dirname, '..', 'public', 'Image', 'root_compressed');

  if (!fs.existsSync(compressedFolder)) {
    console.log('Compressed folder does not exist:', compressedFolder);
    return;
  }

  const files = fs.readdirSync(compressedFolder).filter(file => {
    return /\.(jpg|jpeg|png|webp)$/i.test(file) && file !== '.DS_Store';
  });

  console.log(`Found ${files.length} compressed images\n`);

  let deletedCount = 0;
  let uploadedCount = 0;
  let failedCount = 0;

  for (const file of files) {
    const s3Key = `pixel/Image/${file}`;
    const filePath = path.join(compressedFolder, file);

    console.log(`\n--- Processing: ${file} ---`);

    // Step 1: Delete old version
    console.log('Step 1: Deleting uncompressed version...');
    const deleted = await deleteObject(s3Key);
    if (deleted) {
      deletedCount++;
    }

    // Step 2: Upload compressed version
    console.log('Step 2: Uploading compressed version...');
    const uploaded = await uploadFile(filePath, s3Key);
    if (uploaded) {
      uploadedCount++;
    } else {
      failedCount++;
    }
  }

  console.log('\n=== Summary ===');
  console.log(`✓ Deleted: ${deletedCount}`);
  console.log(`✓ Uploaded: ${uploadedCount}`);
  console.log(`✗ Failed: ${failedCount}`);
  console.log('\nAll root-level images have been replaced with compressed versions!');
}

// Run the replacement
replaceRootImages().catch(console.error);
