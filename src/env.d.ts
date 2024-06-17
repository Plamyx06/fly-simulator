interface ImportMetaEnv {
  readonly VITE_APP_API_KEY_CESIUM: string
  readonly VITE_APP_API_KEY_GOOGLE_MAPS: string
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
