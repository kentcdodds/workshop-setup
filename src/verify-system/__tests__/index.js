// eslint-disable-next-line import/default
import verifySystem from '../'

test('resolve null with no errors', async () => {
  const result = await verifySystem()
  expect(result).toBe(null)
})

test(`filters out falsy values (you're quite welcome)`, async () => {
  const result = await verifySystem([undefined, null])
  expect(result).toBe(null)
})

test('calls validators and returns null if no messages returned', async () => {
  const v1 = jest.fn()
  const v2 = jest.fn(() => null)
  const result = await verifySystem([v1, v2])
  expect(result).toBe(null)
  expect(v1).toHaveBeenCalledTimes(1)
  expect(v2).toHaveBeenCalledTimes(1)
})

test('returns an error message if a validator returns one', async () => {
  const result = await verifySystem([() => 'error 1', () => 'error 2']).catch(
    error => error,
  )
  expect(result).toMatchSnapshot()
})

test('properly pluarlizes a single error message', async () => {
  const result = await verifySystem([() => 'error 1']).catch(error => error)
  expect(result).toContain('is an issue')
})

test('properly pluarlizes multiple error messages', async () => {
  const result = await verifySystem([() => 'error 1', () => 'error 2']).catch(
    error => error,
  )
  expect(result).toContain('are some issues')
})
