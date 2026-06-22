import assert from "node:assert/strict";
import { test } from "node:test";

import { createStorage, getSignedDownloadUrl, S3Client } from "../dist/index.js";

const storage = createStorage({
  endpoint: "http://localhost:9000",
  region: "us-east-1",
  accessKeyId: "test-key",
  secretAccessKey: "test-secret",
  bucket: "test-bucket",
});

test("createStorage builds an S3 client without connecting", () => {
  assert.ok(storage.client instanceof S3Client);
  assert.equal(storage.bucket, "test-bucket");
});

test("getSignedDownloadUrl signs a URL locally (no network)", async () => {
  const url = await getSignedDownloadUrl(storage, "uploads/file.txt", 600);
  assert.match(url, /test-bucket/);
  assert.match(url, /uploads\/file\.txt/);
  assert.match(url, /X-Amz-Signature=/);
  assert.match(url, /X-Amz-Expires=600/);
});
