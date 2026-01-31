function getOptimalChunkSize(fileSize) {
  const MB = 1024 * 1024
  
  if (fileSize < 20 * MB) return 3 * MB
  if (fileSize < 100 * MB) return 10 * MB
  if (fileSize < 500 * MB) return 20 * MB  
  return 20 * MB                             
}
const FAILURE_RATE = 0.03

export async function simulateUpload(file, onProgress, signal) {
  const chunkSize = getOptimalChunkSize(file.size)
  const totalChunks = Math.ceil(file.size / chunkSize);
  let start = 0
  let chunkIndex = 0

  if (signal?.aborted) throw new Error('Upload cancelled')

  while (start < file.size) {
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)

    try {
      await simulateChunkRequest(chunk, chunkIndex, signal)
    } catch (err) {
      if (err.name === 'AbortError') throw err
      return { success: false, message: `Failed at  ${Math.floor((chunkIndex / totalChunks) * 100)}%` }
    }

    chunkIndex++
    start = end
    const progress = Math.round((start / file.size) * 100)
    onProgress(progress)

    if (signal?.aborted) throw new Error('Upload cancelled')
  }

  return { success: true }
}

function simulateChunkRequest(chunk, index, signal) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      if (Math.random() < FAILURE_RATE) {
        reject(new Error('Chunk upload failed'))
      } else {
        resolve()
      }
    }, 400 + Math.random() * 600)

    signal?.addEventListener('abort', () => {
      clearTimeout(timeout)
      reject(new DOMException('Aborted', 'AbortError'))
    })
  })
}