export const seedFake = (db) => {
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

  return { ws1, ws2, clientSession2 }
}