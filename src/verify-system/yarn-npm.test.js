/* eslint no-console:0 */
import cpMock from 'child_process'
import {oneLine} from 'common-tags'
import {satisfies as satisfiesMock} from 'semver'
import validateYarnNpm from './yarn-npm'

jest.mock('child_process')

test('returns null if conditions are satisfied', () => {
  setup({satisfiesYarn: true})
  const desiredYarn = '^0.21.3'
  const result = validateYarnNpm(desiredYarn)()
  expect(result).toBe(null)
})

test('returns yarn mismatch error when yarn version is wrong', () => {
  const mockYarnVersion = '0.21.3'
  setup({satisfiesYarn: false, mockYarnVersion})
  const desiredYarn = '^0.20.3'
  const result = validateYarnNpm(desiredYarn)()
  expect(result).toContain(desiredYarn)
  expect(result).toContain(mockYarnVersion)
  expect(result).toMatchSnapshot()
})

test('returns yarn is not installed error when yarn version is wrong', () => {
  setup({
    mockYarnVersion: () => {
      throw new Error('blah')
    },
  })
  const desiredYarn = '^0.20.3'
  const desiredNpm = '^4.0.3'
  const result = validateYarnNpm(desiredYarn, desiredNpm)()
  expect(result).toContain('install yarn')
  expect(result).toMatchSnapshot()
})

test('returns npm version mismatch', () => {
  const mockNpmVersion = '3.11.3'
  setup({
    mockNpmVersion,
    satisfiesNpm: false,
    mockYarnVersion: () => {
      throw new Error('blah')
    },
  })
  const desiredYarn = '^0.20.3'
  const desiredNpm = '^4.0.3'
  const result = validateYarnNpm(desiredYarn, desiredNpm)()
  expect(result).toContain(desiredNpm)
  expect(result).toContain(mockNpmVersion)
  expect(result).toContain('use npm')
  expect(result).toMatchSnapshot()
})

function setup(
  {
    mockYarnVersion = '0.21.3',
    mockNpmVersion = '4.0.3',
    satisfiesYarn = true,
    satisfiesNpm = true,
  } = {},
) {
  satisfiesMock.mockClear()
  cpMock.execSync.mockClear()
  satisfiesMock.mockImplementation(satisfiesMockImplementation)
  cpMock.execSync.mockImplementation(execSyncMock)

  function satisfiesMockImplementation(actual, desired) {
    if (actual === mockYarnVersion) {
      return satisfiesYarn
    } else if (actual === mockNpmVersion) {
      return satisfiesNpm
    } else {
      console.error(
        oneLine`
          called satisifies with "${desired}, ${actual}".
          ${actual} does not match yarn@${mockYarnVersion}
          or npm@${mockNpmVersion}
        `,
      )
      throw new Error('satisfies mock implementation insufficient')
    }
  }

  function execSyncMock(command) {
    if (command.includes('yarn')) {
      return callAndReturn(mockYarnVersion)
    } else if (command.includes('npm')) {
      return callAndReturn(mockNpmVersion)
    } else {
      console.error(
        oneLine`
          called execSync with "${command}".
          This does not include yarn or npm
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
