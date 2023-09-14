import type { AstroIntegration } from 'astro'
import { playgroundElementsPlugin } from './playground-elements-plugin'

const playgroundElements = (): AstroIntegration => {
  return {
    name: 'astro-playground-elements',
    hooks: {
      'astro:config:setup': ({ updateConfig }) => {
        updateConfig({
          vite: {
            plugins: [playgroundElementsPlugin()],
          },
        })
      },
    },
  }
}

export default playgroundElements
