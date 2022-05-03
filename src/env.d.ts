interface ImportMetaEnv extends Readonly<Record<string, string>> {
  // only `string` type here to avoid hard-to-debug cast problems in your components!
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_BUILD_EPOCH?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
