import type { KnipConfig } from 'knip'

const knipConfig: KnipConfig = {
  entry: ['./src/main.ts!', 'eslint.config.ts'],
  project: ['**/*.{js,ts}'],
}

export default knipConfig
