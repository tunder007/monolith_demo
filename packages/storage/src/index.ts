import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client };

export interface StorageConfig {
  /** AWS region. Use "auto" for Cloudflare R2. Default "auto". */
  region?: string;
  /** Custom endpoint for S3-compatible providers (R2, MinIO). Omit for AWS S3. */
  endpoint?: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  /** Path-style addressing (needed by MinIO). Defaults to true when an endpoint is set. */
  forcePathStyle?: boolean;
}

export interface Storage {
  client: S3Client;
  bucket: string;
}

/** Create an S3-compatible storage handle. Does not make any network call. */
export function createStorage(config: StorageConfig): Storage {
  const client = new S3Client({
    region: config.region ?? "auto",
    endpoint: config.endpoint,
    forcePathStyle: config.forcePathStyle ?? Boolean(config.endpoint),
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
  return { client, bucket: config.bucket };
}

export interface UploadOptions {
  key: string;
  body: PutObjectCommandInput["Body"];
  contentType?: string;
}

/** Upload an object. Returns the stored key. */
export async function uploadFile(
  storage: Storage,
  options: UploadOptions,
): Promise<{ key: string }> {
  await storage.client.send(
    new PutObjectCommand({
      Bucket: storage.bucket,
      Key: options.key,
      Body: options.body,
      ContentType: options.contentType,
    }),
  );
  return { key: options.key };
}

/** Presign a time-limited download URL. Signed locally — no network call. */
export function getSignedDownloadUrl(
  storage: Storage,
  key: string,
  expiresIn = 3600,
): Promise<string> {
  return getSignedUrl(storage.client, new GetObjectCommand({ Bucket: storage.bucket, Key: key }), {
    expiresIn,
  });
}

/** Delete an object. */
export async function deleteFile(storage: Storage, key: string): Promise<void> {
  await storage.client.send(new DeleteObjectCommand({ Bucket: storage.bucket, Key: key }));
}
