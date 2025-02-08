/**
 * wallls.ts - Media Processing and Gallery Generation Tool
 *
 * This script processes media files (images, videos, audio) in a directory structure,
 * generating previews, thumbnails, and markdown documentation for each file.
 * It creates an organized gallery structure with proper navigation and metadata.
 */

import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";
import { execSync } from "child_process";
import { encode as encodeUrl } from "querystring";
import { parseArgs } from "util";

// Cache for processed files
const processedCache = new Map<
  string,
  {
    mtime: number;
    result: MediaFile;
  }
>();

// Structured logging utilities for consistent output formatting
const log = {
  info: (message: string, context?: any) => {
    console.log(`[${new Date().toISOString()}] INFO: ${message}`);
    if (context) console.log(JSON.stringify(context, null, 2));
  },
  warn: (message: string, context?: any) => {
    console.warn(`[${new Date().toISOString()}] WARN: ${message}`);
    if (context) console.warn(JSON.stringify(context, null, 2));
  },
  error: (message: string, error?: any) => {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`);
    if (error)
      console.error(
        error instanceof Error ? error.stack : JSON.stringify(error, null, 2),
      );
  },
  success: (message: string) => {
    console.log(`[${new Date().toISOString()}] SUCCESS: ${message}`);
  },
};

/**
 * Configuration for media processing behavior
 */
interface ProcessingConfig {
  /** Maximum directory depth to process */
  maxDepth: number;
  /** Directories to skip during processing */
  excludedDirs: string[];
  /** Markdown options */
  markdown: {
    /** Create markdown index page parent directories if one not found */
    writeIndex: boolean;
    /** Create matching markdown files for media */
    writeForMedia: boolean;
  }
  /** Preview size configurations */
  sizes: Array<{
    /** Identifier for this size variant */
    name: string;
    /** Target width in pixels or 'auto' to maintain aspect ratio */
    width: number | "auto";
    /** Opt */
    height?: number;
    /** JPEG quality (1-100) */
    quality?: number;
    /** How the image should be resized to fit the dimensions */
    fit?: "cover" | "contain" | "inside";
  }>;
  /** Processing optimization settings */
  processing: {
    /** Number of files to process in parallel */
    batchSize: number;
    /** Enable file processing cache */
    cacheEnabled: boolean;
    /** Use worker threads for image processing */
    useWorkers: boolean;
    /** Maximum concurrent operations */
    concurrency: number;
  };
}

/**
 * Represents a processed media file and its metadata
 */
interface MediaFile {
  /** Absolute path to the media file */
  path: string;
  /** Type of media (image, video, audio) */
  type: MediaType;
  /** File creation timestamp */
  created: Date;
  /** Additional metadata about the media */
  metadata: MediaMetadata;
}

/**
 * Metadata associated with a media file
 */
interface MediaMetadata {
  /** Display title for the media */
  title: string;
  /** Hierarchical tags for organization */
  tags: string[];
  /** Map of preview variant names to their file paths */
  previews: Record<string, string>;
}

enum MediaType {
  Image = "image",
  Video = "video",
  Audio = "audio",
}

/**
 * Recursively processes a directory for media files
 * @param dirPath - Path to the directory to process
 * @param config - Processing configuration
 * @param depth - Current recursion depth
 */
async function processDirectory(
  dirPath: string,
  config: ProcessingConfig,
  depth = 0,
): Promise<void> {
  if (depth > config.maxDepth) {
    log.warn(`Max depth ${config.maxDepth} reached at ${dirPath}`, {
      dirPath,
      maxDepth: config.maxDepth,
    });
    return;
  }

  if (config.excludedDirs.some((excluded) => dirPath.includes(excluded))) {
    log.info(`Skipping excluded directory`, { dirPath });
    return;
  }

  try {
    const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

    // Efficiently separate directories and files
    const [batchDirs, batchFiles] = entries.reduce<[string[], string[]]>(
      ([dirs, files], entry) => {
        if (entry.isDirectory()) dirs.push(entry.name);
        else if (isMediaFile(entry.name)) files.push(entry.name);
        return [dirs, files];
      },
      [[], []],
    );

    // Process media files in parallel batches
    const mediaFiles = await processBatch(
      batchFiles,
      config.processing.batchSize,
      async (filename) => {
        const fullPath = path.join(dirPath, filename);
        const result = await processMediaFile(fullPath);

        if (config.markdown.writeForMedia) {
          await generateMediaMarkdown(fullPath, {
            created: result.created,
            title: result.metadata.title,
            previews: result.metadata.previews,
          });
        }

        return result
      },
    );

    // Process subdirectories in parallel with controlled concurrency
    await processBatch(batchDirs, config.processing.concurrency, async (dir) => {
      const fullPath = path.join(dirPath, dir);
      await processDirectory(fullPath, config, depth + 1);
    });

    if (config.markdown.writeIndex) {
      await generateIndexMarkdown(dirPath, mediaFiles);
    }
  } catch (error) {
    log.error(`Error processing directory`, { dirPath, error });
  }
}

/**
 * Checks if a file is a supported media type based on its extension
 * @param filename - Name of the file to check
 * @returns true if the file has a supported media extension
 */
function isMediaFile(filename: string): boolean {
  const mediaExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".mp4",
    ".webm",
    ".mp3",
    ".wav",
  ];
  return mediaExtensions.some((ext) => filename.toLowerCase().endsWith(ext));
}

/**
 * Processes a single media file, generating previews and documentation
 * @param filePath - Path to the media file
 * @returns Promise resolving to the processed media file metadata
 */
async function processMediaFile(filePath: string): Promise<MediaFile> {
  const stats = await fs.promises.stat(filePath);

  // Check cache if enabled
  if (config.processing.cacheEnabled) {
    const cached = processedCache.get(filePath);
    if (cached && cached.mtime === stats.mtimeMs) {
      return cached.result;
    }
  }

  const ext = path.extname(filePath).toLowerCase();
  const basename = path.basename(filePath, ext);
  const dirPath = path.dirname(filePath);

  // Determine media type
  const type = getMediaType(ext);

  // Generate preview paths
  const previews: Record<string, string> = {};
  for (const size of config.sizes) {
    previews[size.name] = `${basename}--${size.name}${ext}`;
  }

  // Process media based on type // Commented out for debugging
  if (type === MediaType.Image) {
    await processImage(filePath, previews, dirPath);
  } else if (type === MediaType.Video) {
    await processVideo(filePath, previews, dirPath);
  }

  return {
    path: filePath,
    type,
    created: stats.birthtime,
    metadata: {
      title: basename,
      tags: generateTags(filePath),
      previews,
    },
  };
}

async function generateIndexMarkdown(
  dirPath: string,
  mediaFiles: MediaFile[],
): Promise<void> {
  const folderName = path.basename(dirPath);
  const firstImage = mediaFiles.find((file) => file.type === MediaType.Image);
  const filePath = path.join(dirPath, "index.md");

  // Check if the file already exists
  try {
    await fs.promises.access(filePath);
    console.log(`${filePath} already exists. No changes were made.`);
    return;
  } catch {
    // File does not exist, proceed to write it
  }

  const content = `---
title: ${folderName}
date: 2000-01-01
banner: ${firstImage?.metadata.previews.banner || ""}
tags: 
  - #gallery 
  - #gallery/${folderName}
---

${[...mediaFiles]
      .sort((a, b) => {
        // First sort by creation date (newest first)
        const dateCompare = b.created.getTime() - a.created.getTime();
        if (dateCompare !== 0) return dateCompare;
        
        // If dates are equal, sort by filename
        return path.basename(a.path).localeCompare(path.basename(b.path));
      })
      .map((file) => {
        const fullName = path.basename(file.path);
        const baseName = fullName.substring(0, fullName.lastIndexOf("."));
        const filepath = path.join(path.relative(process.cwd(), dirPath), baseName);
        return `![[${filepath}|${fullName}]]\n`;
      })
      .join("")}
`;

  await fs.promises.writeFile(path.join(dirPath, "index.md"), content);
}

/**
 * Processes an image file, creating various sized previews
 * Handles both static images and animated GIFs
 * @param filePath - Path to the image file
 * @param previews - Map of preview names to output paths
 * @param dirPath - Directory to save preview files
 */
async function processImage(
  filePath: string,
  previews: MediaMetadata["previews"],
  dirPath: string,
): Promise<void> {
  const isAnimated = path.extname(filePath).toLowerCase() === ".gif";

  // First create original copy
  await fs.promises.copyFile(
    filePath,
    path.join(dirPath, previews["original"]),
  );

  // Process other sizes
  for (const size of config.sizes.filter((s) => s.name !== "original")) {
    const image = sharp(filePath, {
      animated: isAnimated,
      pages:
        isAnimated && (size.name === "banner" || size.name === "thumb")
          ? 1
          : undefined,
      page:
        isAnimated && (size.name === "banner" || size.name === "thumb")
          ? 2
          : undefined,
    });

    if (size.width || size.height) {
      image.resize(
        size.width === "auto" ? undefined : size.width,
        size.height,
        {
          fit: size.fit || "cover",
        },
      );
    }

    if (isAnimated) {
      // For banner and thumb sizes, convert GIFs to static JPEG
      if (size.name === "banner" || size.name === "thumb") {
        await image
          .jpeg({ quality: size.quality || 85 })
          .toFile(path.join(dirPath, previews[size.name]));
      } else {
        // For other sizes, optimize GIF
        await image
          .gif({
            effort: 10, // Higher effort = better compression
            colours: 128, // Reduce color palette
            loop: 0,
            dither: 1.0, // Full dithering for better quality
          })
          .toFile(path.join(dirPath, previews[size.name]));
      }
    } else {
      await image
        .jpeg({ quality: size.quality || 85 })
        .toFile(path.join(dirPath, previews[size.name]));
    }
  }

  // Last create optimized preview -- in-place
  await fs.promises.copyFile(path.join(dirPath, previews["preview"]), filePath);
}

async function processVideo(
  filePath: string,
  previews: MediaMetadata["previews"],
  dirPath: string,
): Promise<void> {
  try {
    // Check if ffmpeg is available
    execSync("ffmpeg -version", { stdio: "ignore" });
  } catch (error) {
    throw new Error("ffmpeg is required but not found in PATH");
  }

  // Create original copy
  await fs.promises.copyFile(
    filePath,
    path.join(dirPath, previews["original"]),
  );

  // Extract thumbnail frame
  execSync(
    `ffmpeg -i "${filePath}" -ss 00:00:01 -vframes 1 "${path.join(dirPath, previews.thumb)}"`,
  );

  // Create banner
  execSync(
    `ffmpeg -i "${filePath}" -ss 00:00:01 -vframes 1 -vf "scale=1200:400:force_original_aspect_ratio=increase,crop=1200:400" "${path.join(dirPath, previews.banner)}"`,
  );

  // Optimize full video
  execSync(
    `ffmpeg -i "${filePath}" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k "${path.join(dirPath, previews.full)}"`,
  );
}

async function generateMediaMarkdown(
  filePath: string,
  info: { title: string; created: Date; previews: MediaMetadata["previews"] },
): Promise<void> {
  const filename = path.basename(filePath);
  const content = `---
title: ${filename}
date: 2000-01-01
banner: ${info.previews.banner}
tags: 
  - #gallery 
  - #media/${filename}
---

${info.previews.thumb ? `![[/${path.join(path.dirname(filePath), info.previews.thumb)}|${filename}]]` : ""}

${Object.entries(info.previews)
      .map(
        ([name, preview]) =>
          `- [[/${path.join(path.dirname(filePath), preview)}|View ${name}]]`,
      )
      .join("\n")}

## Source

- [TinEye Reverse Image Search](https://tineye.com/search?url=${encodeUrl(`${process.env.SITE_URL ?? "https://kuhree.com"}/${filePath}`)})
`;

  await fs.promises.writeFile(
    `${filePath.substring(0, filePath.lastIndexOf("."))}.md`,
    content,
  );
}

function getMediaType(ext: string): MediaType {
  const imageExts = [".jpg", ".jpeg", ".png", ".gif"];
  const videoExts = [".mp4", ".webm"];
  const audioExts = [".mp3", ".wav"];

  if (imageExts.includes(ext)) return MediaType.Image;
  if (videoExts.includes(ext)) return MediaType.Video;
  if (audioExts.includes(ext)) return MediaType.Audio;

  throw new Error(`Unsupported file extension: ${ext}`);
}

/**
 * Process items in batches with controlled concurrency
 */
async function processBatch<T, R>(
  items: T[],
  batchSize: number,
  processor: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  return results;
}

function generateTags(filePath: string): string[] {
  const relativePath = path.relative(process.cwd(), filePath);
  const pathSegments = relativePath.split(path.sep);
  return [
    "gallery",
    ...pathSegments.map(
      (_, index) => `gallery/${pathSegments.slice(0, index + 1).join("/")}`,
    ),
  ];
}

// Default configuration
const config: ProcessingConfig = {
  maxDepth: 5,
  excludedDirs: [".git", "favicon", "node_modules", ".cache"],
  markdown: {
    writeIndex: true,
    writeForMedia: true,
  },
  sizes: [
    { name: "original", width: "auto", quality: 100 },
    { name: "preview", width: "auto", quality: 85 },
    { name: "banner", width: 1200, height: 400, fit: "cover", quality: 70 },
    { name: "thumb", width: 256, height: 256, fit: "inside", quality: 65 },
  ],
  processing: {
    batchSize: 5,
    cacheEnabled: true,
    useWorkers: true,
    concurrency: 3,
  },
};

/**
 * Main entry point for the media processing script
 * Processes the target directory and generates gallery structure
 * @throws Error if processing fails
 */
async function main() {
  const { values, positionals } = parseArgs({
    strict: true,
    allowPositionals: true,
    args: Bun.argv,
    options: {
      targets: {
        type: 'string',
      },
      skipMarkdown: {
        type: 'boolean',
      },
    },
  });


  if (values.skipMarkdown) {
    config.markdown.writeIndex = false;
    config.markdown.writeForMedia = false;
  }

  console.log("postionals", positionals)
  const paths = values.targets?.split(",")
  const targetDirs = paths && paths.length > 0 ? paths : [process.cwd()];

  try {
    log.info(`Starting processing`, { targetDirs: targetDirs });
    log.info(`Using configuration`, config);

    for (const targetDir of targetDirs) {
      log.info(`Starting processing for directory`, { targetDir });

      try {
        await processDirectory(targetDir, config);
        log.success(`Processing completed successfully for directory: ${targetDir}`);
      } catch (error) {
        log.error(`Error during processing for directory: ${targetDir}`, error);
      }
    }

    log.success("Media processing completed successfully!");
  } catch (error) {
    log.error("Error during media processing", error);
    process.exit(1);
  }
}

main();
