import type { Database } from '@seamapi/fake-seam-connect'

export interface Seed {
  ws1PublishableKey: string
  ws2PublishableKey: string
  clientSessionToken2: string
}

export const seedFake = async (db: Database): Seed => {
  const ws1 = db.addWorkspace({ name: 'Seed Workspace 1 (starts empty)' })
  const ws2 = db.addWorkspace({ name: 'Seed Workspace 2 (starts populated)' })
  const ws3 = db.addWorkspace({ name: 'Seed Workspace 3 (simulated outage)' })

  db.simulateWorkspaceOutage(ws3.workspace_id, {
    routes: [
      '/devices/list',
      '/access_codes/list',
      '/thermostats/climate_setting_schedules/list',
    ],
  })

  const cw = db.addConnectWebview({
    workspace_id: ws2.workspace_id,
  })

  const ca = db.addConnectedAccount({
    provider: 'august',
    workspace_id: ws2.workspace_id,
    user_identifier: {
      email: 'jane@example.com',
    },
  })

  db.updateConnectWebview({
    connect_webview_id: cw.connect_webview_id,
    connected_account_id: ca.connected_account_id,
    status: 'authorized',
  })

  db.addDevice({
    connected_account_id: ca.connected_account_id,
    device_type: 'august_lock',
    name: 'Front Door',
    workspace_id: ws2.workspace_id,
  })

  db.addDevice({
    connected_account_id: ca.connected_account_id,
    device_type: 'august_lock',
    name: 'Back Door',
    workspace_id: ws2.workspace_id,
  })

  const clientSession2 = db.addClientSession({
    workspace_id: ws2.workspace_id,
    connect_webview_ids: [cw.connect_webview_id],
    connected_account_ids: [ca.connected_account_id],
    user_identifier_key: 'some_user',
  })

  return {
    ws1PublishableKey: ws1.publishable_key,
    ws2PublishableKey: ws2.publishable_key,
    clientSessionToken2: clientSession2.token,
  }
}
