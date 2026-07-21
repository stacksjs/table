import { dts } from 'bun-plugin-dtsx'

const result = await Bun.build({
  entrypoints: ['src/index.ts'],
  outdir: 'dist',
  format: 'esm',
  target: 'browser',
  minify: true,
  sourcemap: 'external',
  plugins: [dts()],
})

if (!result.success) {
  for (const log of result.logs)
    console.error(log)

  process.exit(1)
}
