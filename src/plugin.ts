import type { Compilation, Compiler } from 'webpack'

interface UserDefinedOptions{

}

const pluginName = 'RenameClassWebpackPlugin'
export class RenameClassWebpackPlugin {
  options: UserDefinedOptions

  constructor (options: UserDefinedOptions) {
    this.options = options
  }

  apply (compiler: Compiler): void {
    compiler.hooks.compilation.tap(
      pluginName,
      this.initializePlugin.bind(this)
    )
  }

  initializePlugin (compilation: Compilation): void {
    // compilation.hooks.
  }
}
