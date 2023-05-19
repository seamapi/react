/** @type {(db: import('@seamapi/fake-seam-connect').Database) => void} */
export const seedFake = (db) => {
  db.addWorkspace({
    name: 'Seed Workspace 1 (starts empty)',
    publishable_key: 'seam_pk_1',
  })

  const ws2 = db.addWorkspace({
    name: 'Seed Workspace 2 (starts populated)',
    publishable_key: fakePublishableKey,
  })

  const cw = db.addConnectWebview({
    workspace_id: ws2.workspace_id,
  })

  const ca = db.addConnectedAccount({
    provider: 'august',
    workspace_id: ws2.workspace_id,
  })

  db.updateConnectWebview({
    connect_webview_id: cw.connect_webview_id,
    connected_account_id: ca.connected_account_id,
    status: 'authorized',
  })

  const device1 = db.addDevice({
    connected_account_id: ca.connected_account_id,
    device_type: 'august_lock',
    name: 'Front Door',
    workspace_id: ws2.workspace_id,
    properties: {
      locked: false,
      online: true,
      door_open: false,
      manufacturer: 'august',
      battery_level: 0.9999532347993827,
      serial_number: '00000004-992d-45a0-bea1-9128fdcd8d12',
      august_metadata: {
        lock_id: 'lock-1',
        house_id: 'house-1',
        lock_name: 'FRONT DOOR',
        has_keypad: true,
        house_name: 'My House',
        keypad_battery_level: 'Not Available',
      },
      supported_code_lengths: [6],
      name: 'FRONT DOOR',
      battery: {
        level: 0.9999532347993827,
        status: 'full',
      },
      image_url:
        'https://connect.getseam.com/assets/images/devices/august_wifi-smart-lock-3rd-gen_silver_front.png',
      image_alt_text: 'August Wifi Smart Lock 3rd Gen, Silver, Front',
      code_constraints: [],
    },
    errors: [
      {
        error_code: 'account_disconnected',
        message: '',
      },
    ],
    warnings: [
      {
        warning_code: 'salto_office_mode',
        message: '',
      },
    ],
  })

  db.addAccessCode({
    device_id: device1.device_id,
    workspace_id: ws2.workspace_id,
    name: "John's Front Door Code",
    code: '1234',
    common_code_key: null,
    type: 'ongoing',
    status: 'set',
    created_at: '2023-05-08T22:38:19.029Z',
    errors: [],
    warnings: [],
    is_managed: true,
  })

  db.addAccessCode({
    device_id: device1.device_id,
    workspace_id: ws2.workspace_id,
    name: "Mary's Front Door Code",
    code: '1111',
    common_code_key: null,
    type: 'ongoing',
    status: 'set',
    created_at: '2023-05-08T22:38:30.963Z',
    errors: [],
    warnings: [],
    is_managed: true,
  })

  const device2 = db.addDevice({
    connected_account_id: ca.connected_account_id,
    device_type: 'august_lock',
    name: 'Back Door',
    workspace_id: ws2.workspace_id,
    properties: {
      locked: false,
      online: true,
      door_open: false,
      manufacturer: 'august',
      battery_level: 0.9999532347993827,
      serial_number: '00000004-992d-45a0-bea1-9128fdcd8d12',
      august_metadata: {
        lock_id: 'lock-3',
        house_id: 'house-1',
        lock_name: 'GARAGE',
        has_keypad: true,
        house_name: 'My House',
        keypad_battery_level: 'Not Available',
      },
      supported_code_lengths: [6],
      name: 'GARAGE',
      battery: {
        level: 0.9999532347993827,
        status: 'full',
      },
      image_url:
        'https://connect.getseam.com/assets/images/devices/august_wifi-smart-lock-3rd-gen_silver_front.png',
      image_alt_text: 'August Wifi Smart Lock 3rd Gen, Silver, Front',
    },
  })

  const device3 = db.addDevice({
    connected_account_id: ca.connected_account_id,
    device_type: 'schlage_lock',
    name: 'Garage',
    workspace_id: ws2.workspace_id,
    properties: {
      locked: false,
      online: true,
      manufacturer: 'schlage',
      battery_level: 0.48,
      serial_number: 'device-1',
      schlage_metadata: {
        model: 'BE489WB',
        device_id: 'device-1',
        device_name: 'FRONT DOOR',
        access_code_length: 4,
      },
      supported_code_lengths: [4],
      max_active_codes_supported: 299,
      name: 'FRONT DOOR',
      battery: {
        level: 0.48,
        status: 'good',
      },
      image_url:
        'https://connect.getseam.com/assets/images/devices/schlage_sense-smart-deadbolt-with-camelot-trim_front.png',
      image_alt_text: 'Schlage Sense Smart Deadbolt with Camelot Trim, Front',
    },
  })

  db.addClientSession({
    workspace_id: ws2.workspace_id,
    connect_webview_ids: [cw.connect_webview_id],
    connected_account_ids: [ca.connected_account_id],
    user_identifier_key: fakeUserIdentifierKey,
    token: 'seam_cst1_0000',
    device1,
    device2,
    device3,
  })
}

export const fakePublishableKey = 'seam_pk_1'
export const fakeUserIdentifierKey = 'some_user'
