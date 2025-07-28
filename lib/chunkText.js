export function chunkText(text, chunkSize = 1000) {
  const chunks = []
  let startIndex = 0
  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length)
    const chunk = text.slice(startIndex, endIndex)
    chunks.push(chunk)
    startIndex = endIndex
  }
  return chunks
}