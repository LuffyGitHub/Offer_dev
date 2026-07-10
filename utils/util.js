function formatTime(date) {
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  return `${y}-${m}-${d}`
}

function formatTimeDetail(date) {
  const h = pad(date.getHours())
  const m = pad(date.getMinutes())
  return `${formatTime(date)} ${h}:${m}`
}

function pad(n) {
  return n < 10 ? '0' + n : '' + n
}

function todayStr() {
  return formatTime(new Date())
}

function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function pickRandom(arr, n) {
  return shuffleArray(arr).slice(0, n)
}

module.exports = { formatTime, formatTimeDetail, todayStr, shuffleArray, pickRandom }
