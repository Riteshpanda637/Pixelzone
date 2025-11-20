# Media Storage Guide

## Overview
This project uses object storage to host large media files (videos and images) instead of storing them in the Git repository.

## Configuration

The storage configuration is in `.env.local`:

```env
STORAGE_BASE_URL=https://dev.objectstore.mybeworld.com
AWS_ACCESS_KEY_ID=S0SB3ZZ7QX85RSINCT7E
AWS_SECRET_ACCESS_KEY=GwAKAbvZbyzy53TzU8fXVqR6kFTSwVejMcNLZnuG
AWS_REGION=in-maa-1
S3_BUCKET_NAME=pixel
NEXT_PUBLIC_MEDIA_BASE_URL=https://dev.objectstore.mybeworld.com/pixel
```

## Uploading Media Files

### One-Time Upload

To upload all media files to object storage, run:

```bash
node scripts/upload-to-storage.js
```

This will:
1. Upload all videos from `public/video/` to object storage
2. Upload all images from `public/Image/` to object storage
3. Upload the logo from `public/image/pixelLogo.png`

### Upload Progress

The script shows:
- Number of files found
- File size for each file
- Upload progress with ✓ (success) or ✗ (failed)

### Media URLs

After uploading, your media will be accessible at:
- Base URL: `https://dev.objectstore.mybeworld.com/pixel`
- Videos: `https://dev.objectstore.mybeworld.com/pixel/video/[filename]`
- Images: `https://dev.objectstore.mybeworld.com/pixel/Image/[foldername]/[filename]`

## Development vs Production

### Development (Local)
When `NEXT_PUBLIC_MEDIA_BASE_URL` is NOT set, the app uses local files from the `public/` directory.

### Production (Object Storage)
When `NEXT_PUBLIC_MEDIA_BASE_URL` is set, the app loads media from object storage.

## File Structure

```
public/
├── video/
│   ├── firstSection/      # Videos for explore pages
│   │   ├── video1.mp4
│   │   ├── video2.mp4
│   │   └── ...
│   ├── 4.mp4              # Other videos
│   ├── web.mp4
│   └── ...
├── Image/
│   ├── firatSection/      # Images for various pages
│   ├── secondSection/
│   ├── thirdSection/
│   └── ...
└── image/
    └── pixelLogo.png      # Site logo
```

## Important Notes

1. **Large Files**: The total media size is ~10GB, which is why we use object storage
2. **Git Ignore**: Media files are excluded from Git via `.gitignore`
3. **Upload Time**: Initial upload may take 30-60 minutes depending on internet speed
4. **SSL Certificate**: The script disables SSL verification for development environment

## Troubleshooting

### Upload Fails
If upload fails due to network issues:
1. Check internet connection
2. Verify object storage credentials
3. Re-run the upload script (it will skip already uploaded files)

### Media Not Loading
1. Check `.env.local` has correct `NEXT_PUBLIC_MEDIA_BASE_URL`
2. Verify files are uploaded to object storage
3. Check browser console for 404 errors
4. Ensure object storage bucket has public-read permissions
