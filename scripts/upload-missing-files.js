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

// Function to check if file exists in S3
async function fileExistsInS3(key) {
  try {
    await s3.headObject({
      Bucket: BUCKET_NAME,
      Key: key
    }).promise();
    return true;
  } catch (error) {
    if (error.code === 'NotFound' || error.statusCode === 404) {
      return false;
    }
    throw error;
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
async function uploadMissingFiles() {
  const folderName = process.argv[2] || 'firstsection';
  console.log(`\n=== Uploading Missing Files to ${folderName} ===\n`);

  const localFolder = path.join(__dirname, '..', 'public', 'Image', `${folderName}_compressed`);

  if (!fs.existsSync(localFolder)) {
    console.log('Local folder does not exist:', localFolder);
    return;
  }

  const localFiles = fs.readdirSync(localFolder).filter(file => {
    return /\.(jpg|jpeg|png|webp)$/i.test(file) && file !== '.DS_Store';
  });

  console.log(`Found ${localFiles.length} files in local folder\n`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const file of localFiles) {
    const folderName = process.argv[2] || 'firstsection';
    const s3Key = `pixel/Image/${folderName}/${file}`;
    const filePath = path.join(localFolder, file);

    // Check if file already exists in S3
    const exists = await fileExistsInS3(s3Key);

    if (exists) {
      console.log(`⊘ Skipped (already exists): ${file}`);
      skipped++;
    } else {
      const result = await uploadFile(filePath, s3Key);
      if (result) {
        uploaded++;
      } else {
        failed++;
      }
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`✓ Uploaded: ${uploaded}`);
  console.log(`⊘ Skipped: ${skipped}`);
  console.log(`✗ Failed: ${failed}`);
  console.log(`\nUpload complete!`);
}

// Run the upload
uploadMissingFiles().catch(console.error);
