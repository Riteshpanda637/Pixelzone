// Media base URL - using Linode Object Storage
const LINODE_REGION = 'in-maa-1';
const BUCKET_HOST = 'dev.objectstore.mybeworld.com';
const BUCKET_NAME = 'pixel';
const MEDIA_BASE_URL = `https://${LINODE_REGION}.linodeobjects.com/${BUCKET_HOST}/${BUCKET_NAME}`;

// Helper function to get media URL from object storage
export function getMediaUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  // URL encode the path to handle spaces and special characters
  const encodedPath = cleanPath.split('/').map(segment => encodeURIComponent(segment)).join('/');
  return `${MEDIA_BASE_URL}/${encodedPath}`;
}

// Helper function to check if using object storage
export function isUsingObjectStorage(): boolean {
  return true;
}
