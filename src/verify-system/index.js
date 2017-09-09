import node from './node'
import mongo from './mongo'
import npm from './npm'
import execValidator from './exec-validator'

const commonTags = require('common-tags')
const indentString = require('indent-string')
const semver = require('semver')

export default validateAll
Object.assign(validateAll, {
  utils: {
    execValidator,
    commonTags,
    semver,
  },
  validators: {
    node,
    mongo,
    npm,
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
          commonTags.oneLine`
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
