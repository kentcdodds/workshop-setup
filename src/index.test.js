/* eslint import/default:0 */
import workshopSetup from './'
import installDeps from './install-deps'
import verifySystem from './verify-system'

test('exposes the right stuff', () => {
  expect(workshopSetup).toEqual({
    installDeps,
    verifySystem,
  })
})
