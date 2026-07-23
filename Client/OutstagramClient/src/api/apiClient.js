// 요청 할때마다 Authentication 헤더에 Bearer {token} 을 localStorage에서 받아서 넣어주는 클라이언트

import config from "../utils/config";

export default async function apiFetch({ path, options = {}}) {
  const token = localStorage.getItem("token")

  const headers = {
    ...(options.headers || {})
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${config.api.baseUrl}${path}`, {
    ...options,
    headers
  })

  return response
}