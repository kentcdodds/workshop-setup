var path = require('path')
var setup = require('./dist').setup

setup(require(path.join(process.cwd(), 'package.json')).engines).catch(
  error => {
    console.error(`🚨  There was a problem:`)
    console.error(error)
    console.error(
      `\nIf you would like to just ignore this error, then feel free to do so and install dependencies as you normally would in "${process.cwd()}". Just know that things may not work properly if you do...`,
    )
  },
)

/* eslint no-var:0 */
