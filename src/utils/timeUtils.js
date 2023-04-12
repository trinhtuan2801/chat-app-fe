export const getDurationFromStr = (time_str) => {
  if (typeof time_str === 'number') return time_str
  const unit = time_str[time_str.length - 1]
  const duration = Number(time_str.slice(0, time_str.length - 1))
  switch (unit) {
    case 's': return duration * 1000
    case 'm': return duration * 1000 * 60
    case 'h': return duration * 1000 * 60
    case 'd': return duration * 1000 * 60 * 24
    default: return duration
  }
}