import mockProcess from 'process'
import {satisfies as satisfiesMock} from 'semver'
import validateNode from '../node'

jest.mock('process', () => ({
  versions: {
    node: '6.9.5',
  },
}))

test('returns null if conditions are satisfied', () => {
  setup({version: '6.9.5'})
  const desired = '6.9.5'
  const result = validateNode(desired)()
  expect(result).toBe(null)
})

test('returns error if conditions are not satisfied', () => {
  const mockActual = '4.7.0'
  setup({version: mockActual, satisfies: false})
  const desired = '6.9.5'
  const result = validateNode(desired)()
  expect(result).toContain(desired)
  expect(result).toContain(mockActual)
  expect(result).toMatchSnapshot()
})

function setup({version = '6.9.5', satisfies = true} = {}) {
  mockProcess.versions.node = version
  satisfiesMock.mockClear()
  satisfiesMock.mockImplementation(() => satisfies)
}
