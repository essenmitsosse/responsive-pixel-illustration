import type { KnipConfig } from 'knip'

const knipConfig: KnipConfig = {
  ignoreBinaries: ['dot'],
  project: ['**/*.{js,ts}'],
}

export default knipConfig
