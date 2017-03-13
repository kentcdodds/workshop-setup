import cp from 'child_process'
import {oneLine, oneLineTrim} from 'common-tags'
import semver from 'semver'

const {execSync} = cp

export default getMongoValidator

function getMongoValidator(desired) {
  return validateMongo

  function validateMongo() {
    try {
      const dbRegex = /db version.*?(\d+\.\d+\.\d+)/
      const mongoVersionOutput = execSync('mongod --version').toString()
      const [, actual] = dbRegex.exec(mongoVersionOutput)
      if (!semver.satisfies(actual, desired)) {
        return oneLine`
          Your version of mongo (${actual}) does not satisfy
          the desired range of ${desired}.
          Please install a more recent version:
          https://www.mongodb.com/download-center
        `
      }
    } catch (e) {
      const windowsPath = oneLineTrim`
        https://www.howtogeek.com/
        118594/
        how-to-edit-your-system-path-for-easy-command-line-access/
      `
      const macPath = 'http://stackoverflow.com/a/24322978/971592'
      return oneLine`
        There was an error determining
        your mongo version.
        This could be because the \`mongod\` command
        isn't available in your PATH.
        Learn how to fix this on windows (${windowsPath})
        or on mac (${macPath}).
      `
    }
    return null
  }
}
