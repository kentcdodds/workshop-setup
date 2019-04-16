import process from 'process'
import semver from 'semver'
import oneLine from '../utils/one-line'

export default getNodeValidator

function getNodeValidator(desired) {
  return validateNode

  function validateNode() {
    const actual = process.versions.node
    if (!semver.satisfies(actual, desired)) {
      return oneLine`
        The installed version of node (${actual}) does not satisfy
        the desired range of ${desired}.
        Please install a version within the range. You can use
        http://git.io/nvm or https://github.com/coreybutler/nvm-windows
        to make changing The installed version of node easier.
      `
    }
    return null
  }
}
