import execValidator from './exec-validator'

const {oneLine} = require('common-tags')

export default getYarnAndNPMValidator

function getYarnAndNPMValidator(desired) {
  return validateYarnAndNpm

  function validateYarnAndNpm() {
    return execValidator(desired, 'npm --version', actual => {
      return oneLine`
        Your version of npm (${actual}) does not satisfy
        the desired range of ${desired}.
        You should install yarn anyway, but if you would
        rather use npm, please at least have a version within
        the specified version range.
        You can install the latest version by running
        \`npm install --global npm@${desired}\`.
      `
    })
  }
}
