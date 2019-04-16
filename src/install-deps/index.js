import path from 'path'
import fs from 'fs'
import cp from 'child_process'

export default installDeps

function installDeps(directories = [process.cwd()], {yarnOk} = {}) {
  if (!Array.isArray(directories)) {
    directories = [directories]
  }

  let promise = Promise.resolve()
  directories.forEach(dir => {
    promise = promise.then(() => spawnInstall(dir))
  })
  return promise

  function spawnInstall(cwd) {
    return new Promise((resolve, reject) => {
      const hasPkgLock = fs.existsSync(
        path.join(process.cwd(), 'package-lock.json'),
      )
      const hasYarnLock = fs.existsSync(path.join(process.cwd(), 'yarn.lock'))
      const useYarn = yarnOk && (hasYarnLock || !hasPkgLock)
      let installer = 'npm'
      let installerArgs = [
        hasPkgLock ? 'ci' : 'install',
        hasPkgLock ? null : '--no-package-lock',
      ].filter(Boolean)

      if (useYarn) {
        installer = 'yarn'
        installerArgs = [hasYarnLock ? null : '--no-lockfile'].filter(Boolean)
      } else if (!yarnOk && (hasYarnLock && !hasPkgLock)) {
        console.warn(
          `⚠️  "${cwd}" has a yarn.lock file, but this system does not have the right version of yarn installed.`,
          `We'll install using npm instead, but you may experience issues. Install the correct version of yarn to get rid of this warning.`,
        )
      }

      const command = [installer, ...installerArgs].join(' ')
      console.log(`📦  starting \`${command}\` in "${cwd}"`)

      const child = cp.spawn(installer, installerArgs, {
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
