
/**
 * 현재 시각 반환
 * 
 * `${year}-${month}-${date} ${hour}:${minute}:${second}`
 */
export function currTime() {
  const now = new Date()
  
  const year = String(now.getFullYear())
  const month = String(now.getMonth()+1).padStart(2, "0")
  const date = String(now.getDate()).padStart(2, "0")

  const hour = String(now.getHours()).padStart(2, "0")
  const minute = String(now.getMinutes()).padStart(2, "0")
  const second = String(now.getSeconds()).padStart(2, "0")

  return `${year}-${month}-${date} ${hour}:${minute}:${second}`
}

export function fileCurrTime() {
  const now = new Date()

  const year = String(now.getFullYear())
  const month = String(now.getMonth()+1).padStart(2, "0")
  const date = String(now.getDate()).padStart(2, "0")

  const hour = String(now.getHours()).padStart(2, "0")
  const minute = String(now.getMinutes()).padStart(2, "0")
  const second = String(now.getSeconds()).padStart(2, "0")

  return `${year}-${month}-${date}_${hour}h${minute}m${second}s`
}