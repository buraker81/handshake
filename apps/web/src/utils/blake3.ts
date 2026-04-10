import { blake3 } from "@noble/hashes/blake3.js"
import { bytesToHex } from "@noble/hashes/utils.js"

const CHUNK_SIZE = 4 * 1024 * 1024 // 4 MB

export async function hashFile(
  file: File,
  onProgress: (pct: number) => void
): Promise<string> {
  const hasher = blake3.create({})
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE)

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE
    const end = Math.min(start + CHUNK_SIZE, file.size)
    const buffer = await file.slice(start, end).arrayBuffer()
    hasher.update(new Uint8Array(buffer))
    onProgress(Math.round(((i + 1) / totalChunks) * 100))
    // Yield to event loop — keeps UI responsive on large files
    await new Promise<void>((r) => setTimeout(r, 0))
  }

  return bytesToHex(hasher.digest())
}
