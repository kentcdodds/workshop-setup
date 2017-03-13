import cp from 'child_process'
import {oneLine} from 'common-tags'
import semver from 'semver'
import execValidator from './exec-validator'

const {execSync} = cp

export default getYarnAndNPMValidator

function getYarnAndNPMValidator(desired, desiredNpm) {
  return validateYarnAndNpm

  function validateYarnAndNpm() {
    try {
      const actual = execSync('yarn --version').toString().trim()
      if (!semver.satisfies(actual, desired)) {
        return oneLine`
          Your version of yarn (${actual}) does not satisfy
          the desired range of ${desired}.
          Run \`yarn self-update\`
          (or \`npm install --global yarn@${desired}\`)
          to update.
        `
      }
    } catch (e) {
      let message = oneLine`
        You do not have yarn installed. This is a package manager client
        that installs from the regular npm registry, but ensures you get
        the same versions of all dependencies required for this repository.
        It is highly recommended that you install yarn:
        \`npm install --global yarn@${desired}\`
        (learn more: https://yarnpkg.com/)
      `
      message += '\n'
      message += oneLine`
        Note that you can also ignore this
        warning and continue with npm if you prefer.
      `
      const npmMessage = execValidator(desiredNpm, 'npm --version', actual => {
        return oneLine`
          Your version of npm (${actual}) does not satisfy
          the desired range of ${desiredNpm}.
          You should install yarn anyway, but if you would
          rather use npm, please at least have a version within
          the specified version range.
          You can install the latest version by running
          \`npm install --global npm@${desiredNpm}\`.
        `
      })
      message += npmMessage ? `\n${npmMessage}` : ''
      return message
    }
    return null
  }
}
