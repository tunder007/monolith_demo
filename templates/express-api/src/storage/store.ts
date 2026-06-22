import { createStorage } from "@softeneers/storage";

import { env } from "../env.js";

// An S3-compatible storage handle (AWS S3 / Cloudflare R2 / MinIO). No network
// call until you upload or sign a URL.
export const storage = createStorage({
  accessKeyId: env.S3_ACCESS_KEY_ID,
  secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  bucket: env.S3_BUCKET,
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT || undefined,
});
