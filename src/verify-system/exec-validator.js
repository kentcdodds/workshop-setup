import {execSync} from 'child_process'
import semver from 'semver'
import oneLine from '../utils/one-line'

export default execValidator

function execValidator(desired, command, message) {
  let actual = '0.0.0'
  try {
    actual = execSync(command)
      .toString()
      .trim()
  } catch (error) {
    return oneLine`
      There was an error running the command \`${command}\`:
      ${error.message}
    `
  }
  return semver.satisfies(actual, desired) ? null : message(actual, desired)
}
