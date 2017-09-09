/* eslint no-console:0 */
const cp = require('child_process')
const console = require('console')

export default installDeps

function installDeps(directories = [process.cwd()]) {
  if (!Array.isArray(directories)) {
    directories = [directories]
  }

  console.log(`📦  Installing dependencies via npm install`)

  let promise = Promise.resolve()
  directories.forEach(dir => {
    promise = promise.then(() => spawnInstall(dir))
  })
  return promise

  function spawnInstall(cwd) {
    return new Promise((resolve, reject) => {
      console.log(`🔑  starting install in ${cwd}`)
      const child = cp.spawn('npm', ['install'], {
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
