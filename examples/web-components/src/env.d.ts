import 'vite/client'

interface ImportMetaEnv {
  readonly SEAM_ENDPOINT: string
  readonly SEAM_PUBLISHABLE_KEY: string
  readonly SEAM_USER_IDENTIFIER_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
