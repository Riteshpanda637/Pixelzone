const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffprobeInstaller = require('@ffprobe-installer/ffprobe');
const fs = require('fs');
const path = require('path');

// Set FFmpeg and FFprobe paths
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

// Configuration
const VIDEO_QUALITY = 28; // CRF value (18-28 is good, lower = better quality but larger size)
const MAX_WIDTH = 1920; // Maximum width (1080p)
const VIDEO_CODEC = 'libx264'; // H.264 codec for wide compatibility
const AUDIO_BITRATE = '128k'; // Audio bitrate

// Function to get video metadata
function getVideoInfo(inputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata);
    });
  });
}

// Function to compress a single video
async function compressVideo(inputPath, outputPath) {
  const fileName = path.basename(inputPath);

  return new Promise(async (resolve, reject) => {
    try {
      const stats = fs.statSync(inputPath);
      const originalSize = stats.size;

      console.log(`\nProcessing: ${fileName}`);
      console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);

      // Get video info
      const metadata = await getVideoInfo(inputPath);
      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      const duration = metadata.format.duration;

      ffmpeg(inputPath)
        .videoCodec(VIDEO_CODEC)
        .audioCodec('aac')
        .audioBitrate(AUDIO_BITRATE)
        .outputOptions([
          `-crf ${VIDEO_QUALITY}`,
          '-preset medium',
          '-movflags +faststart', // Enable fast start for web streaming
          `-vf scale='min(${MAX_WIDTH},iw):-2'` // Scale down if larger than MAX_WIDTH, maintain aspect ratio
        ])
        .on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
          if (progress.percent) {
            process.stdout.write(`\rProgress: ${progress.percent.toFixed(1)}%`);
          }
        })
        .on('end', () => {
          const newStats = fs.statSync(outputPath);
          const newSize = newStats.size;
          const reduction = ((originalSize - newSize) / originalSize * 100).toFixed(1);

          console.log(`\n✓ Completed: ${fileName}`);
          console.log(`  New size: ${(newSize / 1024 / 1024).toFixed(2)} MB`);
          console.log(`  Reduction: ${reduction}%`);

          resolve({
            success: true,
            originalSize,
            newSize,
            reduction,
            fileName
          });
        })
        .on('error', (err) => {
          console.error(`\n✗ Error processing ${fileName}:`, err.message);
          reject({
            success: false,
            error: err.message,
            fileName
          });
        })
        .save(outputPath);

    } catch (error) {
      console.error(`✗ Error with ${fileName}:`, error.message);
      reject({
        success: false,
        error: error.message,
        fileName
      });
    }
  });
}

// Function to find all videos recursively
function findVideos(dir) {
  let videos = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      videos = videos.concat(findVideos(fullPath));
    } else if (/\.(mp4|mov|avi|mkv)$/i.test(file)) {
      videos.push(fullPath);
    }
  }

  return videos;
}

// Main function
async function compressAllVideos() {
  console.log('\n=== Video Compression Script ===\n');

  const videoFolder = path.join(__dirname, '..', 'public', 'video');
  const compressedFolder = path.join(__dirname, '..', 'public', 'video_compressed');

  if (!fs.existsSync(videoFolder)) {
    console.log('Video folder does not exist:', videoFolder);
    return;
  }

  // Create compressed folder structure
  if (!fs.existsSync(compressedFolder)) {
    fs.mkdirSync(compressedFolder, { recursive: true });
  }

  const videos = findVideos(videoFolder);
  console.log(`Found ${videos.length} videos to compress\n`);

  let totalOriginalSize = 0;
  let totalNewSize = 0;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    const relativePath = path.relative(videoFolder, video);
    const outputPath = path.join(compressedFolder, relativePath);
    const outputDir = path.dirname(outputPath);

    // Create subdirectory if needed
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`\n[${i + 1}/${videos.length}] Processing: ${relativePath}`);

    try {
      const result = await compressVideo(video, outputPath);
      totalOriginalSize += result.originalSize;
      totalNewSize += result.newSize;
      successCount++;
    } catch (error) {
      failCount++;
      console.error(`Failed: ${error.fileName} - ${error.error}`);
    }
  }

  const totalReduction = totalOriginalSize > 0
    ? ((totalOriginalSize - totalNewSize) / totalOriginalSize * 100).toFixed(1)
    : 0;

  console.log('\n\n=== Summary ===');
  console.log(`✓ Compressed: ${successCount}`);
  console.log(`✗ Failed: ${failCount}`);
  console.log(`Original Size: ${(totalOriginalSize / 1024 / 1024 / 1024).toFixed(2)} GB`);
  console.log(`New Size: ${(totalNewSize / 1024 / 1024 / 1024).toFixed(2)} GB`);
  console.log(`Total Reduction: ${totalReduction}%`);
  console.log(`\nCompressed videos saved to: ${compressedFolder}`);
}

// Run compression
compressAllVideos().catch(console.error);
