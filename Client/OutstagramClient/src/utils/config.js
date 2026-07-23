const config = {
  host: {
    address: import.meta.env.VITE_HOST_ADDRESS,
    port: import.meta.env.VITE_HOST_PORT,
    origin: `http://${import.meta.env.VITE_HOST_ADDRESS}:${import.meta.env.VITE_HOST_PORT}`
  },
  api: {
    baseUrl: `http://${import.meta.env.VITE_HOST_ADDRESS}:${import.meta.env.VITE_HOST_PORT}/api`
  }
}

export default config