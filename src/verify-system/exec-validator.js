const {execSync} = require('child_process')
const semver = require('semver')

export default execValidator

function execValidator(desired, command, message) {
  const actual = execSync(command)
    .toString()
    .trim()
  return semver.satisfies(actual, desired) ? null : message(actual, desired)
}
