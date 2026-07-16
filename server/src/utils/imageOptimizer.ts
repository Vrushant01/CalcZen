import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Resolve uploads path inside process.cwd()
const UPLOADS_DIR = path.resolve(process.cwd(), "uploads/blog");

/**
 * Downloads an external image, converts it to optimized WebP format,
 * resizes it to multiple widths (1200px, 800px, 400px), and saves it locally.
 * Returns the local relative path from root.
 */
export async function optimizeAndStoreImage(imageUrl: string, slug: string): Promise<string> {
  if (!imageUrl) return "";

  // Skip if it's already a local path, base64 data, or points to the site domain
  if (
    imageUrl.startsWith("/") ||
    imageUrl.startsWith("data:") ||
    imageUrl.includes("calczen.in") ||
    imageUrl.includes("localhost")
  ) {
    return imageUrl;
  }

  try {
    console.log(`[IMAGE OPTIMIZER] Downloading external image: ${imageUrl}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
    
    const response = await fetch(imageUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch image (HTTP ${response.status})`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // Ensure uploads directory exists
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    // Define filenames and destinations
    const baseFilename = `${slug}.webp`;
    const destPath = path.join(UPLOADS_DIR, baseFilename);

    console.log(`[IMAGE OPTIMIZER] Converting and saving WebP to: ${destPath}`);

    // 1. Generate and save the 1200px width WebP (main featured image)
    await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .toFormat("webp", { quality: 82 })
      .toFile(destPath);

    // 2. Generate and save smaller sizes for responsive srcset: 800px and 400px
    const sizes = [800, 400];
    for (const size of sizes) {
      const sizeFilename = `${slug}-${size}.webp`;
      const sizeDestPath = path.join(UPLOADS_DIR, sizeFilename);
      await sharp(buffer)
        .resize({ width: size, withoutEnlargement: true })
        .toFormat("webp", { quality: 82 })
        .toFile(sizeDestPath);
    }

    // Return the local relative path
    return `/uploads/blog/${baseFilename}`;
  } catch (err: any) {
    console.error(`[IMAGE OPTIMIZER] Error optimizing image ${imageUrl}:`, err.message);
    return imageUrl; // Fallback to the original URL if anything fails
  }
}
