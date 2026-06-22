# @softeneers/storage

S3-compatible object storage for Softeneers projects — works with **AWS S3,
Cloudflare R2, and MinIO**.

## Usage

```ts
import { createStorage, uploadFile, getSignedDownloadUrl, deleteFile } from "@softeneers/storage";

const storage = createStorage({
  endpoint: env.S3_ENDPOINT, // omit for AWS S3; set for R2/MinIO
  region: env.S3_REGION, // "auto" for R2
  accessKeyId: env.S3_ACCESS_KEY_ID,
  secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  bucket: env.S3_BUCKET,
});

await uploadFile(storage, { key: "avatars/1.png", body: buffer, contentType: "image/png" });
const url = await getSignedDownloadUrl(storage, "avatars/1.png", 3600);
await deleteFile(storage, "avatars/1.png");
```

## API

- `createStorage(config)` — storage handle `{ client, bucket }` (no network on construct).
- `uploadFile(storage, { key, body, contentType? })` — returns `{ key }`.
- `getSignedDownloadUrl(storage, key, expiresIn?)` — presigned GET URL (signed locally).
- `deleteFile(storage, key)`.
- Re-exports `S3Client` and the command classes for advanced use.

Pair with [`@softeneers/env`](../env/README.md) to validate the S3 credentials.
