import commonTags, {oneLine} from 'common-tags'
import indentString from 'indent-string'
import semver from 'semver'
import node from './node'
import mongo from './mongo'
import yarnNpm from './yarn-npm'
import execValidator from './exec-validator'

module.exports = validateAll
Object.assign(module.exports, {
  utils: {
    execValidator,
    commonTags,
    semver,
  },
  validators: {
    node,
    mongo,
    yarnNpm,
  },
})

function validateAll(validators = []) {
  const promises = validators.filter(Boolean).map(v => Promise.resolve(v()))
  return Promise.all(promises).then(results => {
    const errors = results.filter(Boolean)
    const errorCount = errors.length

    if (errorCount) {
      const errorMessages = errors.map(error => `- ${error}`).join('\n')
      const one = errorCount === 1

      return Promise.reject(
        [
          oneLine`
          There ${one ? 'is an issue' : 'are some issues'} with your system.
        `,
          indentString(errorMessages, 2),
        ].join('\n'),
      )
    } else {
      return null
    }
  })
}
