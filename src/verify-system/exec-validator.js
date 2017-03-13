import cp from 'child_process'
import semver from 'semver'

const {execSync} = cp

export default execValidator

function execValidator(desired, command, message) {
  const actual = execSync(command).toString().trim()
  return semver.satisfies(actual, desired) ? null : message(actual, desired)
}
