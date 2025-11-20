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

// Function to list all objects in bucket
async function listAllObjects(prefix = '') {
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

// Function to set ACL for an object
async function setPublicReadACL(key) {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: key,
      ACL: 'public-read'
    };

    await s3.putObjectAcl(params).promise();
    console.log(`✓ Fixed permissions for: ${key}`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to fix permissions for ${key}:`, error.message);
    return false;
  }
}

// Main function
async function fixAllPermissions() {
  console.log('\n=== Fixing Object Storage Permissions ===\n');

  // Get all objects with 'pixel/' prefix
  const objects = await listAllObjects('pixel/');

  if (objects.length === 0) {
    console.log('No objects found in pixel/ folder.');
    return;
  }

  console.log(`Found ${objects.length} objects in pixel/ folder. Updating permissions...\n`);

  let success = 0;
  let failed = 0;

  for (const obj of objects) {
    // Skip directories (keys ending with /)
    if (obj.Key.endsWith('/')) {
      continue;
    }

    const result = await setPublicReadACL(obj.Key);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`✓ Success: ${success}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`\nAll files should now be publicly accessible.`);
}

// Run the fix
fixAllPermissions().catch(console.error);
