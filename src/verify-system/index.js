import indentString from 'indent-string'
import semver from 'semver'
import oneLine from '../utils/one-line'
import node from './node'
import npm from './npm'
import yarn from './yarn'
import execValidator from './exec-validator'

export default validateAll

Object.assign(validateAll, {
  utils: {
    execValidator,
    oneLine,
    semver,
  },
  validators: {
    node,
    npm,
    yarn,
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
