import cpMock from 'child_process'
import {satisfies as satisfiesMock} from 'semver'
import oneLine from '../../utils/one-line'
import validateNpm from '../npm'

jest.mock('child_process')

test('returns npm version mismatch', () => {
  const mockNpmVersion = '3.11.3'
  setup({
    mockNpmVersion,
    satisfiesNpm: false,
    mockYarnVersion: () => {
      throw new Error('blah')
    },
  })
  const desiredNpm = '^4.0.3'
  const result = validateNpm(desiredNpm)()
  expect(result).toContain(desiredNpm)
  expect(result).toContain(mockNpmVersion)
  expect(result).toMatchSnapshot()
})

function setup({mockNpmVersion = '4.0.3', satisfiesNpm = true} = {}) {
  satisfiesMock.mockClear()
  cpMock.execSync.mockClear()
  satisfiesMock.mockImplementation(satisfiesMockImplementation)
  cpMock.execSync.mockImplementation(execSyncMock)

  function satisfiesMockImplementation(actual, desired) {
    if (actual === mockNpmVersion) {
      return satisfiesNpm
    } else {
      console.error(
        oneLine`
          called satisifies with "${desired}, ${actual}".
          ${actual} does not match npm@${mockNpmVersion}
        `,
      )
      throw new Error('satisfies mock implementation insufficient')
    }
  }

  function execSyncMock(command) {
    if (command.includes('npm')) {
      return callAndReturn(mockNpmVersion)
    } else {
      console.error(
        oneLine`
          called execSync with "${command}".
          This does not include npm
        `,
      )
      throw new Error('execSync mock implementation insufficient')
    }
  }

  function callAndReturn(thing) {
    if (typeof thing === 'function') {
      thing = thing()
    }
    return thing
  }
}
