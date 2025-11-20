const AWS = require('aws-sdk');
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

// Function to set public-read ACL on an object
async function setPublicReadACL(key) {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      ACL: 'public-read'
    };

    await s3.putObjectAcl(params).promise();
    console.log(`✓ Fixed permissions: ${key}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to fix permissions for ${key}:`, error.message);
    return false;
  }
}

// Function to fix permissions for all videos in a folder
async function fixPermissionsInFolder(folderPath) {
  console.log(`\n--- Fixing permissions in ${folderPath} ---\n`);

  const objects = await listAllObjects(folderPath);

  // Filter to only video files (not folders)
  const videoFiles = objects.filter(obj => {
    // Skip folder markers (keys ending with /)
    if (obj.Key.endsWith('/')) return false;

    // Only include video files
    return /\.(mp4|mov|avi|mkv)$/i.test(obj.Key);
  });

  if (videoFiles.length === 0) {
    console.log(`No video files found in ${folderPath}`);
    return { success: 0, failed: 0 };
  }

  console.log(`Found ${videoFiles.length} video files to fix.\n`);

  let success = 0;
  let failed = 0;

  for (const obj of videoFiles) {
    const result = await setPublicReadACL(obj.Key);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  return { success, failed };
}

// Main function
async function fixAllVideoPermissions() {
  console.log(`\n=== Fixing Video Permissions in Object Storage ===\n`);

  const folders = [
    'pixel/video/'
  ];

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const folder of folders) {
    const result = await fixPermissionsInFolder(folder);
    totalSuccess += result.success;
    totalFailed += result.failed;
  }

  console.log(`\n=== Final Summary ===`);
  console.log(`✓ Total Fixed: ${totalSuccess}`);
  console.log(`✗ Total Failed: ${totalFailed}`);
  console.log(`\nAll video permissions have been set to public-read.`);
}

// Run the fix
fixAllVideoPermissions().catch(console.error);
