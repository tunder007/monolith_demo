import { Hono } from "hono";

import { deleteFile, getSignedDownloadUrl, uploadFile } from "@softeneers/storage";

import { storage } from "./store.js";

export const files = new Hono();

// Upload raw bytes: POST the file body to /api/files/:key
files.post("/:key", async (c) => {
  const key = c.req.param("key");
  await uploadFile(storage, {
    key,
    body: Buffer.from(await c.req.arrayBuffer()),
    contentType: c.req.header("content-type"),
  });
  return c.json({ key }, 201);
});

// Get a time-limited download URL for an object.
files.get("/:key/url", async (c) => {
  return c.json({ url: await getSignedDownloadUrl(storage, c.req.param("key")) });
});

// Delete an object.
files.delete("/:key", async (c) => {
  await deleteFile(storage, c.req.param("key"));
  return c.body(null, 204);
});
