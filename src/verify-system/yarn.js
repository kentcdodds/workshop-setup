import oneLine from '../utils/one-line'
import execValidator from './exec-validator'

export default getYarnValidator

function getYarnValidator(desired) {
  return validateYarn

  function validateYarn() {
    return execValidator(desired, 'yarn --version', actual => {
      return oneLine`
        The installed version of yarn (${actual}) does not satisfy
        the desired range of ${desired}.
        Please at least have a version within the specified version range.
        Updating to the latest version of yarn depends on how you installed it
        in the first place. Please see more information here:
        https://yarnpkg.com/en/docs/install
      `
    })
  }
}
