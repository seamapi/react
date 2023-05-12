import type { Compiler } from 'copy-webpack-plugin'

declare class CspPlugin {
  apply: (compiler: Compiler) => void
}

export default CspPlugin
