import type { Plugin } from 'vite'
import * as fs from 'fs'
import * as path from 'path'
import resolve from 'resolve'

export class Context {
  private workerAssets: Map<string, Uint8Array> = new Map()
  private workerEntries = ['playground-service-worker.js', 'playground-typescript-worker.js']
  private packageName = 'playground-elements'
  private packagePath = ''
  private root = ''

  filterId(id: string): boolean {
    return id.includes(this.packageName)
  }

  setRootPath(value: string) {
    this.root = value
    this.packagePath = path.dirname(
      resolve.sync(this.packageName, {
        basedir: value,
        preserveSymlinks: false,
      })
    )
  }

  getWorkerAssets() {
    return this.workerAssets
  }

  async updateWorkerAssets(id: string, code: string) {
    if (!this.filterId(id)) {
      return null
    }
    for (const workerFile of this.workerEntries) {
      const workerFileUrl = path.join(path.dirname(id), workerFile).replace(this.root, '')

      if (code.includes(workerFile) && !this.workerAssets.has(workerFileUrl)) {
        const assetPath = path.join(this.packagePath, workerFile)
        const assetContent = await fs.promises.readFile(assetPath)
        this.workerAssets.set(workerFileUrl, assetContent)
      }
    }
  }
}

export const playgroundElementsPlugin = (): Plugin => {
  const cx = new Context()
  return {
    name: 'vite-plugin-playground-elements',
    apply: 'serve',
    async transform(code, id) {
      await cx.updateWorkerAssets(id, code)
    },
    configResolved(config) {
      cx.setRootPath(config.root)
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const workerAssets = cx.getWorkerAssets()
        if (req.url && workerAssets.has(req.url)) {
          console.log('found')
          res.writeHead(200, { 'Content-Type': 'text/javascript' })
          return res.end(workerAssets.get(req.url))
        }
        next()
      })
    },
  }
}
