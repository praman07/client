/**
 * Board Thumbnail Generator
 *
 * Converts Excalidraw elements into a WebP Uint8Array via exportToBlob.
 *
 * Uses `maxWidthOrHeight` (not `getDimensions`) so Excalidraw computes the
 * tight bounding box of all elements and scales to fit — no cropping, no
 * corner artefacts. The output aspect ratio matches the actual drawing.
 */

import { exportToBlob } from '@excalidraw/excalidraw'

// Longest side of the thumbnail — Excalidraw scales the other axis to match
const MAX_SIDE = 800
const WEBP_QUALITY = 0.7
// Padding (px) around elements so nothing is flush against the edge
const EXPORT_PADDING = 16

export async function generateBoardThumbnail(
   
  elements: ReadonlyArray<any>,
): Promise<Uint8Array> {
  const blob = await exportToBlob({
    elements: elements as any,
    appState: {
      exportBackground: true,
      exportWithDarkMode: false,
    },
    files: null,
    mimeType: 'image/webp',
    quality: WEBP_QUALITY,
    // maxWidthOrHeight: Excalidraw auto-fits all elements into this bound.
    // The tight bounding box is computed internally — we never crop.
    maxWidthOrHeight: MAX_SIDE,
    exportPadding: EXPORT_PADDING,
  })
  return new Uint8Array(await blob.arrayBuffer())
}
