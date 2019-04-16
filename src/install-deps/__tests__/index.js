import cpMock from 'child_process'
import installDeps from '../' // eslint-disable-line import/default

jest.mock('child_process')

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {})
  jest.spyOn(console, 'warn').mockImplementation(() => {})
  jest.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  console.log.mockRestore()
  console.warn.mockRestore()
  console.error.mockRestore()
})

test('installs via npm', async () => {
  await testInstallDeps()
  const installer = 'npm'
  const args = ['install', '--no-package-lock']
  expect(cpMock.spawn).toHaveBeenCalledWith(installer, args, {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd(),
  })
})

test('installs in the given directory', async () => {
  const mockCwd = './dir'
  await testInstallDeps({installDepsArgs: mockCwd})
  expect(cpMock.spawn).toHaveBeenCalledWith(
    expect.any(String),
    expect.any(Array),
    {
      stdio: 'inherit',
      shell: true,
      cwd: mockCwd,
    },
  )
})

test('installs in all given directories', async () => {
  const mockCwds = ['./dir1', './dir2', './dir3']
  await testInstallDeps({installDepsArgs: mockCwds})
  mockCwds.forEach(cwd => {
    expect(cpMock.spawn).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Array),
      {
        stdio: 'inherit',
        shell: true,
        cwd,
      },
    )
  })
})

test('rejects if an exit code is non-zero', async () => {
  const onMock = jest.fn((event, callback) => {
    const exitCode = 1
    callback(exitCode)
  })
  let error
  try {
    await testInstallDeps({onMock})
  } catch (e) {
    error = e
  }
  expect(error).toEqual(process.cwd())
  expect(console.error).toHaveBeenCalledTimes(1)
})

async function testInstallDeps({onMock, installDepsArgs} = {}) {
  // not sure why, but default args for onMock messed things up...
  const onSpy = jest.fn(onMock || defaultOnMock)
  cpMock.spawn.mockClear()
  cpMock.spawn.mockImplementation(() => ({on: onSpy}))
  await installDeps(installDepsArgs)
  expect(cpMock.spawn).toHaveBeenCalledTimes(getSpawnCalls())
  expect(onSpy).toHaveBeenCalledWith('exit', expect.any(Function))

  function getSpawnCalls() {
    if (!installDepsArgs || !Array.isArray(installDepsArgs)) {
      return 1
    } else {
      return installDepsArgs.length
    }
  }

  function defaultOnMock(event, callback) {
    if (event === 'exit') {
      const exitCode = 0
      callback(exitCode)
    } else {
      throw new Error('should not call on with anything but `exit`')
    }
  }
}

/* eslint no-console:0 */
