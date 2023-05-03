/** @type {(globalConfig: import('@jest/types').Config.GlobalConfig, globalConfig: import('@jest/types').Config.ProjectConfig) => Promise<void>} */
module.exports = async function (_globalConfig, projectConfig) {
  const { create } = await import('@seamapi/fake-seam-connect')
  const url = new URL(projectConfig.globals.JEST_SEAM_ENDPOINT)
  const fake = await create()

  const db = fake.database.getState()

  const ws1 = db.addWorkspace({ name: "Seed Workspace 1 (starts empty)" })
  const ws2 = db.addWorkspace({ name: "Seed Workspace 2 (starts populated)" })

  const cw = db.addConnectWebview({
    workspace_id: ws2.workspace_id,
  })

  const ca = db.addConnectedAccount({
    provider: "august",
    workspace_id: ws2.workspace_id,
  })

  db.updateConnectWebview({
    connect_webview_id: cw.connect_webview_id,
    connected_account_id: ca.connected_account_id,
    status: "authorized",
  })

  db.addDevice({
    connected_account_id: ca.connected_account_id,
    device_type: "august_lock",
    name: "Front Door",
    workspace_id: ws2.workspace_id,
  })

  db.addDevice({
    connected_account_id: ca.connected_account_id,
    device_type: "august_lock",
    name: "Back Door",
    workspace_id: ws2.workspace_id,
  })

  const clientSession2 = db.addClientSession({
    workspace_id: ws2.workspace_id,
    connect_webview_ids: [cw.connect_webview_id],
    connected_account_ids: [ca.connected_account_id],
    user_identifier_key: "seed_client_session_user_2",
  })

  await fake.startServer(url.port)
  projectConfig.globals.JEST_SEAM_PUBLISHABLE_KEY_1 = ws1.publishable_key
  projectConfig.globals.JEST_SEAM_PUBLISHABLE_KEY_2 = ws2.publishable_key
  projectConfig.globals.JEST_SEAM_CLIENT_SESSION_TOKEN_2 = clientSession2.token
  globalThis.__FAKE_SEAM_CONNECT__ = fake
}
