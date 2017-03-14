/* eslint no-console:0 */
import cp from 'child_process'
import console from 'console'

module.exports = installDeps

function installDeps(directories = [process.cwd()]) {
  if (!Array.isArray(directories)) {
    directories = [directories]
  }
  let installer, args
  try {
    cp.execSync('yarn --version')
    // yay! No error! Yarn's available!
    installer = 'yarn'
    // ignore the cache, platform, and engines
    args = ['--force --ignore-platform --ignore-engines']
  } catch (e) {
    // use npm instead :-(
    installer = 'npm'
    args = ['install']
  }

  console.log(`📦  Installing dependencies via ${installer} ${args.join(' ')}`)

  let promise = Promise.resolve()
  directories.forEach(dir => {
    promise = promise.then(() => spawnInstall(dir))
  })
  return promise

  function spawnInstall(cwd) {
    return new Promise((resolve, reject) => {
      console.log(`🔑  starting install in ${cwd}`)
      const child = cp.spawn(installer, args, {
        stdio: 'inherit',
        shell: true,
        cwd,
      })
      child.on('exit', onExit)

      function onExit(code) {
        if (code === 0) {
          console.log(`🎉  finished installing dependencies in "${cwd}"`)
          resolve()
        } else {
          console.error(`💀  error installing dependencies in "${cwd}"`)
          reject(cwd)
        }
      }
    })
  }
}
