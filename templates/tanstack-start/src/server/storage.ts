import { createServerFn } from '@tanstack/react-start'

import { createStorage, deleteFile, getSignedDownloadUrl, uploadFile } from '@softeneers/storage'

import { env } from './env'

const storage = createStorage({
  accessKeyId: env.S3_ACCESS_KEY_ID,
  secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  bucket: env.S3_BUCKET,
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT || undefined,
})

// Server functions for S3-compatible storage. uploadText is a simple demo;
// for binary uploads, accept a base64 string or use a presigned upload URL.
export const uploadText = createServerFn({ method: 'POST' })
  .validator((data: unknown) => {
    const d = (data ?? {}) as Record<string, unknown>
    return { key: String(d.key ?? 'demo.txt'), content: String(d.content ?? '') }
  })
  .handler(async ({ data }) => {
    await uploadFile(storage, { key: data.key, body: data.content, contentType: 'text/plain' })
    return { key: data.key }
  })

export const getFileUrl = createServerFn({ method: 'GET' })
  .validator((key: unknown) => String(key))
  .handler(async ({ data: key }) => ({ url: await getSignedDownloadUrl(storage, key) }))

export const removeFile = createServerFn({ method: 'POST' })
  .validator((key: unknown) => String(key))
  .handler(async ({ data: key }) => {
    await deleteFile(storage, key)
    return { deleted: true }
  })
