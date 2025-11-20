const AWS = require('aws-sdk');
const https = require('https');

// Disable SSL certificate verification for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Configure AWS S3 - Using Linode endpoint directly
const s3 = new AWS.S3({
  accessKeyId: 'S0SB3ZZ7QX85RSINCT7E',
  secretAccessKey: 'GwAKAbvZbyzy53TzU8fXVqR6kFTSwVejMcNLZnuG',
  region: 'in-maa-1',
  endpoint: 'https://in-maa-1.linodeobjects.com',
  s3ForcePathStyle: false,
  signatureVersion: 'v4'
});

const BUCKET_NAME = 'dev.objectstore.mybeworld.com';

// Function to list all objects with a prefix
async function listAllObjects(prefix) {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Prefix: prefix
    };

    const data = await s3.listObjectsV2(params).promise();
    return data.Contents || [];
  } catch (error) {
    console.error('Error listing objects:', error.message);
    return [];
  }
}

// Function to delete an object
async function deleteObject(key) {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key
    };

    await s3.deleteObject(params).promise();
    console.log(`✓ Deleted: ${key}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to delete ${key}:`, error.message);
    return false;
  }
}

// Function to delete only image files from a folder
async function deleteImagesFromFolder(folderPath) {
  console.log(`\n--- Deleting images from ${folderPath} ---\n`);

  const objects = await listAllObjects(folderPath);

  // Filter to only image files (not folders)
  const imageFiles = objects.filter(obj => {
    // Skip folder markers (keys ending with /)
    if (obj.Key.endsWith('/')) return false;

    // Only include image files
    return /\.(jpg|jpeg|png|webp)$/i.test(obj.Key);
  });

  if (imageFiles.length === 0) {
    console.log(`No image files found in ${folderPath}`);
    return { success: 0, failed: 0 };
  }

  console.log(`Found ${imageFiles.length} image files to delete.\n`);

  let success = 0;
  let failed = 0;

  for (const obj of imageFiles) {
    const result = await deleteObject(obj.Key);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  return { success, failed };
}

// Main function
async function deleteAllImages() {
  console.log(`\n=== Deleting Image Files from Object Storage ===\n`);

  const folders = [
    'pixel/Image/firstsection/',
    'pixel/Image/secondSection/'
  ];

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const folder of folders) {
    const result = await deleteImagesFromFolder(folder);
    totalSuccess += result.success;
    totalFailed += result.failed;
  }

  console.log(`\n=== Final Summary ===`);
  console.log(`✓ Total Deleted: ${totalSuccess}`);
  console.log(`✗ Total Failed: ${totalFailed}`);
  console.log(`\nAll image files have been deleted. Folders remain intact.`);
}

// Run the deletion
deleteAllImages().catch(console.error);
