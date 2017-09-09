const process = require('process')
const semver = require('semver')
const {oneLine} = require('common-tags')

export default getNodeValidator

function getNodeValidator(desired) {
  return validateNode

  function validateNode() {
    const actual = process.versions.node
    if (!semver.satisfies(actual, desired)) {
      return oneLine`
        Your version of node (${actual}) does not satisfy
        the desired range of ${desired}.
        Please install a version within the range. You can use
        http://git.io/nvm or https://github.com/coreybutler/nvm-windows
        to make changing your version of node easier.
      `
    }
    return null
  }
}
