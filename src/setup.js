import verifySystem from './verify-system'
import installDeps from './install-deps'

export default setup

async function setup({directories, node, yarn, npm}) {
  const nodeError = await verifySystem.validators.node(node)()
  if (nodeError) {
    return Promise.reject(nodeError)
  }
  const npmError = await verifySystem.validators.npm(npm)()
  const yarnError = await verifySystem.validators.yarn(yarn)()
  if (yarnError && npmError) {
    const errorMessage = [
      verifySystem.utils.oneLine`
        We tried to validate The installed version of npm and yarn and both failed.
        We recommend you fix yarn, but fixing either will resolve this issue.
        Here are the validation error messages for each:
      `,
      '',
      yarnError,
      '',
      npmError,
    ].join('\n')
    return Promise.reject(errorMessage)
  }
  return installDeps(directories, {yarnOk: !yarnError})
}
