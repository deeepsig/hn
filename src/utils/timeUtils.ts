/**
 * Converts a unix timestamp to a human-readable relative time string
 */
export function getRelativeTime(unixSec: number): string {
  const now = Date.now()
  const thenMs = unixSec * 1000
  const deltaMs = now - thenMs

  const seconds = Math.floor(deltaMs / 1000)
  if (seconds < 60) return `${seconds} second${seconds !== 1 ? 's' : ''} ago`

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`

  const d = new Date(thenMs)
  const month = d.toLocaleString('en-US', { month: 'short' })
  const day = d.getDate()
  return `${month} ${day}`
}
