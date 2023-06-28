/** @type {(db: import('@seamapi/fake-seam-connect').Database) => void} */
export const seedFake = (db) => {
  db.addWorkspace({
    name: 'Seed Workspace 1 (starts empty)',
    publishable_key: 'seam_pk_1',
    created_at: '2023-04-03T02:14:18.000',
  })

  const ws2 = db.addWorkspace({
    name: 'Seed Workspace 2 (starts populated)',
    publishable_key: fakePublishableKey,
    created_at: '2023-05-15T14:07:48.000',
  })

  const cw = db.addConnectWebview({
    workspace_id: ws2.workspace_id,
    created_at: '2023-05-15T15:08:49.000',
  })

  const ca = db.addConnectedAccount({
    provider: 'august',
    workspace_id: ws2.workspace_id,
    created_at: '2023-05-15T15:08:50.000',
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
    created_at: '2023-05-16T10:17:18.000',
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
      supported_code_lengths: [4, 5, 6],
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
        message: 'Device account has been disconnected.',
      },
    ],
    warnings: [
      {
        warning_code: 'salto_office_mode',
        message:
          'Salto office mode is enabled. Access codes will not unlock doors. You can disable office mode in the Salto dashboard.',
      },
    ],
  })

  db.addAccessCode({
    device_id: device1.device_id,
    workspace_id: ws2.workspace_id,
    created_at: '2023-05-17T00:16:12.000',
    name: "John's Front Door Code",
    code: '1234',
    common_code_key: null,
    type: 'ongoing',
    status: 'set',
    errors: [
      {
        error_code: 'account_disconnected',
        is_connected_account_error: true,
        message:
          'Seam has lost connection to a connected account. This may happen if the third-party provider triggered an access token to be revoked (e.g., after a password change). The account owner needs to reconnect the connected account with a new connect webview.',
        created_at: '2023-06-27T22:50:19.440Z',
      },
      {
        error_code: 'device_disconnected',
        is_device_error: true,
        message: 'Device Disconnected, you may need to reconnect the device.',
        created_at: '2023-06-27T22:50:19.440Z',
      },
      {
        error_code: 'failed_to_set_on_device',
        is_access_code_error: true,
        message:
          'An access code with the same pin already exists on the device.',
        created_at: '2023-06-27T06:01:11.885Z',
      },
      {
        error_code: 'duplicate_code_on_device',
        is_access_code_error: true,
        message:
          'An access code with the same pin already exists on the device.',
        created_at: '2023-06-27T06:01:11.914Z',
      },
    ],
    warnings: [
      {
        warning_code: 'delay_in_setting_on_device',
        message:
          'There was an unusually long delay in programming the code onto the device. For time bound codes, this is sent when the code enters its active time. Note that this is a temporary warning and might be removed if the code is successfully set.',
        created_at: '2023-06-27T06:01:11.885Z',
      },
    ],
    is_managed: true,
  })

  db.addAccessCode({
    device_id: device1.device_id,
    workspace_id: ws2.workspace_id,
    created_at: '2023-05-19T03:11:10.000',
    name: "Mary's Front Door Code",
    code: '1111',
    common_code_key: null,
    type: 'ongoing',
    status: 'set',
    errors: [],
    warnings: [],
    is_managed: true,
  })

  const device2 = db.addDevice({
    connected_account_id: ca.connected_account_id,
    device_type: 'august_lock',
    name: 'Back Door',
    workspace_id: ws2.workspace_id,
    created_at: '2023-05-24T22:15:14.000',
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
    created_at: '2023-05-25T02:05:04.000',
    properties: {
      locked: false,
      online: true,
      manufacturer: 'schlage',
      battery_level: 0.3,
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
        level: 0.3,
        status: 'low',
      },
      image_url:
        'https://connect.getseam.com/assets/images/devices/schlage_sense-smart-deadbolt-with-camelot-trim_front.png',
      image_alt_text: 'Schlage Sense Smart Deadbolt with Camelot Trim, Front',
    },
  })

  db.addClientSession({
    workspace_id: ws2.workspace_id,
    created_at: '2023-05-29T01:02:02.000',
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
