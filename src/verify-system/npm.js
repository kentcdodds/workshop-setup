import oneLine from '../utils/one-line'
import execValidator from './exec-validator'

export default getNPMValidator

function getNPMValidator(desired) {
  return validateNpm

  function validateNpm() {
    return execValidator(desired, 'npm --version', actual => {
      return oneLine`
        The installed version of npm (${actual}) does not satisfy
        the desired range of ${desired}.
        Please at least have a version within the specified version range.
        You can install the latest version by running
        \`npm install --global npm@${desired}\`.
      `
    })
  }
}
