import type { Compilation, Compiler, Stats } from 'webpack'

import optimizer from './optimizer'

export interface Options {}
const runner = (
  compiler: Compiler,
  compilation: Compilation,
  opts: Options
) => {
  const optimize = optimizer(compiler, compilation, opts)
  return (chunks, callback) => {
    optimize(chunks)
    callback()
  }
}

class RenameClassWebpackPlugin {
  private opts: Options
  constructor (opts: Options = {}) {
    this.opts = opts
  }

  apply (compiler: Compiler) {
    compiler.hooks.compilation.tap(
      'RenameClassWebpackPluginHooks',
      (compilation) => {
        compilation.hooks.optimizeChunkAssets.tapAsync(
          'RenameClassWebpackPluginOptimizeChunkAssetsHooks',
          runner(compiler, compilation, this.opts)
        )
      }
    )
  }
}

export { RenameClassWebpackPlugin }
