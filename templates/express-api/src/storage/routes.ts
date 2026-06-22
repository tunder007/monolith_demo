import { Router, raw } from "express";

import { deleteFile, getSignedDownloadUrl, uploadFile } from "@softeneers/storage";

import { storage } from "./store.js";

export const storageRouter = Router();

// Upload raw bytes: PUT/POST the file body to /api/files/:key
storageRouter.post("/:key", raw({ type: "*/*", limit: "10mb" }), async (req, res) => {
  await uploadFile(storage, {
    key: req.params.key,
    body: req.body as Buffer,
    contentType: req.headers["content-type"],
  });
  res.status(201).json({ key: req.params.key });
});

// Get a time-limited download URL for an object.
storageRouter.get("/:key/url", async (req, res) => {
  res.json({ url: await getSignedDownloadUrl(storage, req.params.key) });
});

// Delete an object.
storageRouter.delete("/:key", async (req, res) => {
  await deleteFile(storage, req.params.key);
  res.status(204).end();
});
