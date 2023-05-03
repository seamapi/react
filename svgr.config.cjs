const { basename, extname } = require('node:path')

/** @type {import('@svgr/core').Config} */
module.exports = {
  typescript: true,
  jsxRuntime: 'automatic',
  expandProps: 'none',
  template: (variables, { tpl }) => {
    return tpl`
import type { SVGProps } from 'react'

${variables.interfaces};

export const ${variables.componentName.replace('Svg', '') + 'Icon'} = (${
      variables.props
    }): JSX.Element => (
  ${variables.jsx}
);
`
  },
  indexTemplate: (filePaths) => {
    const exportEntries = filePaths.map((filePath) => {
      const name = basename(filePath, extname(filePath))
      return `export { ${name}Icon } from './${name}.js'`
    })
    return exportEntries.join('\n')
  },
}
