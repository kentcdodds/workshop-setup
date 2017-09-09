import cpMock from 'child_process'
import {satisfies as satisfiesMock} from 'semver'
import execValidator from '../exec-validator'

jest.mock('child_process')

test('returns null if the version is satisfied', () => {
  const mockActual = '1.2.3'
  setup({mockActual})
  const desired = '1.2.3'
  const command = 'split-guide --version'
  expect(execValidator(desired, command, () => 'error')).toBe(null)
  expect(cpMock.execSync).toHaveBeenCalledTimes(1)
  expect(cpMock.execSync).toHaveBeenCalledWith(command)
  expect(satisfiesMock).toHaveBeenCalledTimes(1)
  expect(satisfiesMock).toHaveBeenCalledWith(mockActual, desired)
})

test('returns call to message if the version is not satisfied', () => {
  const mockActual = '1.3.4'
  setup({mockActual, satisfies: false})
  const desired = '1.2.3'
  const command = 'split-guide --version'
  const errorMessage = 'error'
  const messageCallback = jest.fn(() => errorMessage)
  expect(execValidator(desired, command, messageCallback)).toBe(errorMessage)
  expect(messageCallback).toHaveBeenCalledTimes(1)
  expect(messageCallback).toHaveBeenCalledWith(mockActual, desired)
})

function setup({mockActual = '1.2.3', satisfies = true} = {}) {
  satisfiesMock.mockClear()
  cpMock.execSync.mockClear()
  satisfiesMock.mockImplementation(() => satisfies)
  cpMock.execSync.mockImplementation(() => mockActual)
}
