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
    let contentType = 'video/mp4';
    if (fileExt === '.mov') {
      contentType = 'video/quicktime';
    } else if (fileExt === '.avi') {
      contentType = 'video/x-msvideo';
    } else if (fileExt === '.mkv') {
      contentType = 'video/x-matroska';
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

// Function to find all videos recursively
function findVideos(dir, baseDir = dir) {
  let videos = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      videos = videos.concat(findVideos(fullPath, baseDir));
    } else if (/\.(mp4|mov|avi|mkv)$/i.test(file)) {
      const relativePath = path.relative(baseDir, fullPath);
      videos.push({
        fullPath,
        relativePath
      });
    }
  }

  return videos;
}

// Main function
async function replaceVideos() {
  console.log('\n=== Replacing Videos in Object Storage ===\n');

  const compressedFolder = path.join(__dirname, '..', 'public', 'video_compressed');

  if (!fs.existsSync(compressedFolder)) {
    console.log('Compressed video folder does not exist:', compressedFolder);
    return;
  }

  const videos = findVideos(compressedFolder, compressedFolder);
  console.log(`Found ${videos.length} compressed videos\n`);

  let deletedCount = 0;
  let uploadedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < videos.length; i++) {
    const { fullPath, relativePath } = videos[i];
    const s3Key = `pixel/video/${relativePath}`;

    console.log(`\n[${i + 1}/${videos.length}] Processing: ${relativePath}`);

    // Step 1: Delete old version
    console.log('Step 1: Deleting uncompressed version...');
    const deleted = await deleteObject(s3Key);
    if (deleted) {
      deletedCount++;
    }

    // Step 2: Upload compressed version
    console.log('Step 2: Uploading compressed version...');
    const uploaded = await uploadFile(fullPath, s3Key);
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
  console.log('\nAll videos have been replaced with compressed versions!');
}

// Run the replacement
replaceVideos().catch(console.error);
