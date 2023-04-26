const sass = require('sass')
const fs = require('fs')

const result = sass.compile('src/lib/styles/main.scss')

fs.mkdirSync('lib/styles')
fs.writeFileSync('lib/styles/index.css', result.css)
