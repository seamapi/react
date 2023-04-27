const sass = require('sass')
const fs = require('fs')

const result = sass.compile('src/lib/styles/main.scss')

const dir = 'lib/styles'

if (!fs.existsSync(dir)) {
  fs.mkdirSync('lib/styles')
}

fs.rmSync('lib/styles/index.css', { force: true })
fs.writeFileSync('lib/styles/index.css', result.css)
