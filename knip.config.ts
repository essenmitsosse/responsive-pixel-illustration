import type { KnipConfig } from 'knip'

const knipConfig: KnipConfig = {
  entry: ['./src/main.ts!', 'eslint.config.ts'],
  ignore: ['./.dependency-cruiser.js'],
  ignoreBinaries: ['dot'],
  project: ['**/*.{js,ts}'],
}

export default knipConfig
