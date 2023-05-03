/** @type {(globalConfig: import('@jest/types').Config.GlobalConfig, globalConfig: import('@jest/types').Config.ProjectConfig) => Promise<void>} */
module.exports = async function (_globalConfig, projectConfig) {
  const { create } = await import('@seamapi/fake-seam-connect')
  const url = new URL(projectConfig.globals.JEST_SEAM_ENDPOINT)
  const fake = await create()
  await fake.startServer(url.port)
  globalThis.__FAKE_SEAM_CONNECT__ = fake
}
