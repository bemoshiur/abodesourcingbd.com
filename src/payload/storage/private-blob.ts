import { cloudStoragePlugin } from "@payloadcms/plugin-cloud-storage";
import { getFileKey } from "@payloadcms/plugin-cloud-storage/utilities";
import type { Adapter } from "@payloadcms/plugin-cloud-storage/types";
import type { Plugin } from "payload";
import { del, get, put } from "@vercel/blob";

/**
 * Payload storage adapter for a **private** Vercel Blob store.
 *
 * The official @payloadcms/storage-vercel-blob adapter only supports public
 * stores. This one uploads with `access: "private"` and serves files through
 * Payload's own /api/<collection>/file/<name> route, streaming them from Blob
 * with the server-side token. Responses carry a one-year immutable cache header,
 * and next/image caches the optimised variants on the Vercel edge — so visitors
 * effectively get CDN delivery while the bucket itself stays non-public.
 *
 * If a public store is used instead, set BLOB_ACCESS=public and the official
 * adapter (direct CDN URLs) is used automatically — see payload.config.ts.
 */
export function privateBlobStorage(options: {
  token: string | undefined;
  collections: string[];
}): Plugin {
  return (incomingConfig) => {
    const { token } = options;
    if (!token) return incomingConfig; // local dev without a token: uploads stay on disk

    const adapter: Adapter = ({ prefix = "" }) => ({
      name: "vercel-blob-private",

      handleUpload: async ({ data, file: { buffer, filename, mimeType } }) => {
        const { fileKey } = getFileKey({
          collectionPrefix: prefix,
          docPrefix: data.prefix,
          filename,
          useCompositePrefixes: false,
        });
        await put(fileKey, buffer, {
          access: "private",
          allowOverwrite: true,
          contentType: mimeType,
          cacheControlMaxAge: 60 * 60 * 24 * 365,
          token,
        });
        return data;
      },

      handleDelete: async ({ doc, filename }) => {
        const { fileKey } = getFileKey({
          collectionPrefix: prefix,
          docPrefix: (doc as { prefix?: string }).prefix ?? "",
          filename,
          useCompositePrefixes: false,
        });
        await del(fileKey, { token });
      },

      staticHandler: async (req, { headers: incoming, params: { filename } }) => {
        try {
          const { fileKey } = getFileKey({
            collectionPrefix: prefix,
            docPrefix: "",
            filename,
            useCompositePrefixes: false,
          });
          const result = await get(fileKey, { access: "private", token });
          if (!result || result.statusCode !== 200 || !result.stream) {
            return new Response(null, { status: 404, statusText: "Not Found" });
          }

          const etag = result.headers.get("etag");
          const contentType = result.blob.contentType || "application/octet-stream";
          const headers = new Headers(incoming);
          headers.set("Content-Type", contentType);
          headers.set("Cache-Control", "public, max-age=31536000, immutable");
          headers.set("X-Content-Type-Options", "nosniff");
          if (etag) headers.set("ETag", etag);
          const length = result.headers.get("content-length");
          if (length) headers.set("Content-Length", length);
          if (contentType === "image/svg+xml") {
            headers.set("Content-Security-Policy", "script-src 'none'");
          }

          if (etag && req.headers.get("if-none-match") === etag) {
            return new Response(null, { status: 304, headers });
          }
          return new Response(result.stream, { status: 200, headers });
        } catch (err) {
          req.payload.logger.error({ err, msg: "private blob staticHandler failed" });
          return new Response("Internal Server Error", { status: 500 });
        }
      },
    });

    const collections = Object.fromEntries(options.collections.map((slug) => [slug, { adapter }]));

    return cloudStoragePlugin({ collections })({
      ...incomingConfig,
      collections: (incomingConfig.collections ?? []).map((collection) =>
        options.collections.includes(collection.slug)
          ? {
              ...collection,
              upload: {
                ...(typeof collection.upload === "object" ? collection.upload : {}),
                disableLocalStorage: true,
              },
            }
          : collection,
      ),
    });
  };
}
