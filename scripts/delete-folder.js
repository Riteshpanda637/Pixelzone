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

// Main function
async function deleteFolderFromStorage(folderPath) {
  console.log(`\n=== Deleting ${folderPath} from Object Storage ===\n`);

  // Get all objects with the folder prefix
  const objects = await listAllObjects(folderPath);

  if (objects.length === 0) {
    console.log(`No objects found in ${folderPath}`);
    return;
  }

  console.log(`Found ${objects.length} objects to delete.\n`);

  let success = 0;
  let failed = 0;

  for (const obj of objects) {
    const result = await deleteObject(obj.Key);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`✓ Deleted: ${success}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`\nFolder deletion complete.`);
}

// Delete firatSection folder
deleteFolderFromStorage('pixel/Image/firatSection/').catch(console.error);
