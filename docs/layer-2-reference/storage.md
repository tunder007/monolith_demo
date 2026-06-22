# `@softeneers/storage`

S3-compatible object storage with a tiny surface: create a handle, upload,
presign a download URL, delete. Works with **AWS S3, Cloudflare R2, and MinIO**
— the same code, just different `config`.

## Install

```bash
npm i @softeneers/storage
```

Bundles `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`.

## API

### `createStorage(config)`

```ts
function createStorage(config: {
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  region?: string;          // default "auto" (use "auto" for R2)
  endpoint?: string;        // set for R2 / MinIO; omit for AWS S3
  forcePathStyle?: boolean; // defaults to true when an endpoint is set (MinIO needs it)
}): Storage; // { client: S3Client; bucket: string }
```

Creates a storage handle. No network call.

### `uploadFile(storage, { key, body, contentType? })`

Uploads an object; resolves to `{ key }`.

### `getSignedDownloadUrl(storage, key, expiresIn?)`

Returns a time-limited download URL. `expiresIn` is seconds (default `3600`).
**Signed locally — no network call.**

### `deleteFile(storage, key)`

Deletes an object.

### Re-exports

`S3Client` and the `PutObjectCommand` / `GetObjectCommand` / `DeleteObjectCommand`
classes, for operations beyond the helpers.

## Usage

```ts
import { createStorage, uploadFile, getSignedDownloadUrl, deleteFile } from "@softeneers/storage";

const storage = createStorage({
  accessKeyId: env.S3_KEY,
  secretAccessKey: env.S3_SECRET,
  bucket: "uploads",
  // Cloudflare R2:
  endpoint: "https://<account>.r2.cloudflarestorage.com",
  region: "auto",
});

await uploadFile(storage, { key: "avatars/ada.png", body: buffer, contentType: "image/png" });
const url = await getSignedDownloadUrl(storage, "avatars/ada.png", 600); // valid 10 min
await deleteFile(storage, "avatars/ada.png");
```

## Provider cheat-sheet

| Provider | `endpoint` | `region` | `forcePathStyle` |
| -------- | ---------- | -------- | ---------------- |
| AWS S3   | (omit)     | e.g. `us-east-1` | (omit) |
| Cloudflare R2 | `https://<account>.r2.cloudflarestorage.com` | `auto` | (default) |
| MinIO    | `http://localhost:9000` | `us-east-1` | `true` (default with endpoint) |

## Notes

Not auto-wired by any template — add it for file uploads (avatars, attachments,
exports). Presigned URLs let clients upload/download directly without proxying
bytes through your server.
