import cpMock from 'child_process'
import {satisfies as satisfiesMock} from 'semver'
import validateMongo from './mongo'

jest.mock('child_process')

test('returns null if conditions are satisfied', () => {
  setup()
  const desired = '3.4.5'
  const result = validateMongo(desired)()
  expect(result).toBe(null)
})

test('returns version mismatch error', () => {
  const mockActual = '3.8.2'
  const mockExecResult = `db version blah ${mockActual} blah`
  setup({satisfies: false, mockExecResult})
  const desired = '^2.0.0'
  const result = validateMongo(desired)()
  expect(result).toContain(desired)
  expect(result).toContain(mockActual)
  expect(result).toMatchSnapshot()
})

test('returns mongod command not found error', () => {
  cpMock.execSync.mockClear()
  cpMock.execSync.mockImplementation(() => {
    throw new Error('blah')
  })
  const desired = '^2.0.0'
  const result = validateMongo(desired)()
  expect(result).toMatch(/mongod.*isn't available.*PATH/)
  expect(result).toMatchSnapshot()
})

function setup(
  {
    mockExecResult = 'db version blah blah 3.4.5',
    satisfies = true,
  } = {},
) {
  satisfiesMock.mockClear()
  cpMock.execSync.mockClear()
  satisfiesMock.mockImplementation(() => satisfies)
  cpMock.execSync.mockImplementation(() => mockExecResult)
}
