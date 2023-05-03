/** @type {(globalConfig: import('@jest/types').Config.GlobalConfig, globalConfig: import('@jest/types').Config.ProjectConfig) => Promise<void>} */
module.exports = async function (_globalConfig, _projectConfig) {
  await globalThis.__FAKE_SEAM_CONNECT__.stopServer()
}
