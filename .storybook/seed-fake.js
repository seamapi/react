const fakePublishableKey = 'seam_pk_2'

const fakeUserIdentifierKey = 'some_user'

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

  const ws3 = db.addWorkspace({
    name: 'Seed Workspace 3 (simulated outage)',
    publishable_key: 'seam_pk_3',
    created_at: '2023-05-15T14:07:48.000',
  })

  db.simulateWorkspaceOutage(ws3.workspace_id, {
    routes: [
      '/devices/list',
      '/access_codes/list',
      '/thermostats/climate_setting_schedules/list',
    ],
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
      online: false,
      door_open: false,
      manufacturer: 'august',
      battery_level: 0.9999532347993827,
      serial_number: '00000004-992d-45a0-bea1-9128fdcd8d12',
      model: {
        manufacturer_display_name: 'August',
      },
      august_metadata: {
        lock_id: 'lock-1',
        house_id: 'house-1',
        lock_name: 'Front Door',
        has_keypad: true,
        house_name: 'My House',
        keypad_battery_level: 'Not Available',
      },
      supported_code_lengths: [4, 5, 6],
      name: 'Front Door',
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
        is_connected_account_error: true,
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
          'An error occurred when we tried to set the access code on the device. We will continue to try and set the code on the device in case the error was temporary.',
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

  db.addAccessCode({
    device_id: device1.device_id,
    workspace_id: ws2.workspace_id,
    created_at: '2023-05-19T03:11:10.000',
    name: "Bob's Front Door Code",
    code: '3333',
    common_code_key: null,
    type: 'ongoing',
    status: 'set',
    errors: [
      {
        error_code: 'failed_to_set_on_device',
        is_access_code_error: true,
        message:
          'An error occurred when we tried to set the access code on the device. We will continue to try and set the code on the device in case the error was temporary.',
      },
    ],
    warnings: [],
    is_managed: true,
  })

  db.addAccessCode({
    device_id: device1.device_id,
    workspace_id: ws2.workspace_id,
    created_at: '2023-05-19T03:11:10.000',
    name: "Kai's Front Door Code",
    code: '3334',
    common_code_key: null,
    type: 'ongoing',
    status: 'set',
    errors: [],
    warnings: [
      {
        warning_code: 'delay_in_setting_on_device',
        message:
          'There was an unusually long delay in programming the code onto the device. For time bound codes, this is sent when the code enters its active time. Note that this is a temporary warning and might be removed if the code is successfully set.',
      },
    ],
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
      online: false,
      door_open: false,
      manufacturer: 'august',
      battery_level: 0.9999532347993827,
      serial_number: '00000004-992d-45a0-bea1-9128fdcd8d12',
      model: {
        manufacturer_display_name: 'August',
      },
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
        level: 0.98,
        status: 'full',
      },
      image_url:
        'https://connect.getseam.com/assets/images/devices/august_wifi-smart-lock-3rd-gen_silver_front.png',
      image_alt_text: 'August Wifi Smart Lock 3rd Gen, Silver, Front',
    },
    errors: [
      {
        is_device_error: true,
        error_code: 'device_disconnected',
        message: 'Device is disconnected.',
      },
    ],
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
      model: {
        manufacturer_display_name: 'Schlage',
        display_name: 'BE489WB',
      },
      schlage_metadata: {
        model: 'BE489WB',
        device_id: 'device-1',
        device_name: 'Front Door',
        access_code_length: 4,
      },
      supported_code_lengths: [4],
      max_active_codes_supported: 299,
      name: 'Front Door',
      battery: {
        level: 0.3,
        status: 'low',
      },
      image_url:
        'https://connect.getseam.com/assets/images/devices/schlage_sense-smart-deadbolt-with-camelot-trim_front.png',
      image_alt_text: 'Schlage Sense Smart Deadbolt with Camelot Trim, Front',
    },
    errors: [
      {
        is_device_error: true,
        error_code: 'low_battery',
        message: 'Battery level is low.',
      },
    ],
  })

  const device4 = db.addDevice({
    connected_account_id: ca.connected_account_id,
    device_type: 'august_lock',
    name: 'Back Door',
    workspace_id: ws2.workspace_id,
    created_at: '2023-05-24T22:15:14.000',
    properties: {
      locked: true,
      online: true,
      door_open: false,
      manufacturer: 'august',
      battery_level: 0.9999532347993827,
      serial_number: '00000004-992d-45a0-bea1-9128fdcd8d12',
      model: {
        manufacturer_display_name: 'August',
      },
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
        level: 0.8,
        status: 'full',
      },
      image_url:
        'https://connect.getseam.com/assets/images/devices/august_wifi-smart-lock-3rd-gen_silver_front.png',
      image_alt_text: 'August Wifi Smart Lock 3rd Gen, Silver, Front',
    },
    errors: [],
  })

  // Add ecobee thermostats
  const cw2 = db.addConnectWebview({
    workspace_id: ws2.workspace_id,
    created_at: '2023-05-15T15:08:51.000',
  })

  const ca2 = db.addConnectedAccount({
    provider: 'ecobee',
    workspace_id: ws2.workspace_id,
    created_at: '2023-05-15T15:08:52.000',
  })

  db.updateConnectWebview({
    connect_webview_id: cw2.connect_webview_id,
    connected_account_id: ca2.connected_account_id,
    status: 'authorized',
  })

  const device5 = db.addDevice({
    connected_account_id: ca.connected_account_id,
    device_type: 'ecobee_thermostat',
    name: 'Apartment 21A',
    workspace_id: ws2.workspace_id,
    created_at: '2023-05-15T15:08:53.000',
    properties: {
      online: true,
      is_cooling: false,
      is_heating: false,
      is_heating_available: true,
      is_cooling_available: true,
      manufacturer: 'ecobee',
      is_fan_running: false,
      model: {
        manufacturer_display_name: 'Ecobee',
        display_name: 'Thermostat',
      },
      ecobee_metadata: {
        device_name: 'parkway kerosene',
        ecobee_device_id: '14a7f34b-3e44-42b8-a314-ae953f81722a',
      },
      has_direct_power: true,
      relative_humidity: 0.36,
      temperature_celsius: 21.11111111111111,
      temperature_fahrenheit: 70,
      current_climate_setting: {
        hvac_mode_setting: 'heat_cool',
        manual_override_allowed: false,
        automatic_cooling_enabled: true,
        automatic_heating_enabled: true,
        cooling_set_point_fahrenheit: 75,
        heating_set_point_fahrenheit: 65,
      },
      default_climate_setting: {
        hvac_mode_setting: 'heat_cool',
        manual_override_allowed: false,
        automatic_cooling_enabled: true,
        automatic_heating_enabled: true,
        cooling_set_point_fahrenheit: 75,
        heating_set_point_fahrenheit: 65,
      },
      available_hvac_mode_settings: ['off', 'cool', 'heat', 'heat_cool'],
      can_enable_automatic_cooling: true,
      can_enable_automatic_heating: true,
      is_cooling_available: true,
      is_heating_available: true,
      min_heating_cooling_delta_fahrenheit: 5,
      max_cooling_set_point_fahrenheit: 92,
      min_cooling_set_point_fahrenheit: 65,
      max_heating_set_point_fahrenheit: 79,
      min_heating_set_point_fahrenheit: 45,
      max_cooling_set_point_celsius: 33.333333333333336,
      max_heating_set_point_celsius: 26.11111111111111,
      min_cooling_set_point_celsius: 18.333333333333336,
      min_heating_set_point_celsius: 7.222222222222222,
      min_heating_cooling_delta_celsius: 2.7777777777777777,
      is_temporary_manual_override_active: false,
      name: 'Apartment 21A',
      image_url:
        'https://connect.getseam.com/assets/images/devices/ecobee_3-lite_front.png',
      image_alt_text: 'Placeholder Lock Image',
      is_climate_setting_schedule_active: false,
    },
    errors: [],
  })

  const device6 = db.addDevice({
    connected_account_id: ca.connected_account_id,
    device_type: 'ecobee_thermostat',
    name: 'debating book',
    workspace_id: ws2.workspace_id,
    created_at: '2023-05-15T15:08:53.000',
    properties: {
      online: true,
      is_cooling: false,
      is_heating: false,
      manufacturer: 'ecobee',
      is_fan_running: false,
      model: {
        manufacturer_display_name: 'Ecobee',
        display_name: 'Thermostat',
      },
      ecobee_metadata: {
        device_name: 'debating book',
        ecobee_device_id: '14a7f34b-3e44-42b8-a314-ae953f81722a',
      },
      has_direct_power: true,
      relative_humidity: 0.36,
      temperature_celsius: 21.11111111111111,
      temperature_fahrenheit: 70,
      current_climate_setting: {
        hvac_mode_setting: 'heat',
        manual_override_allowed: false,
        automatic_cooling_enabled: false,
        automatic_heating_enabled: true,
        heating_set_point_celsius: 20,
        heating_set_point_fahrenheit: 68,
      },
      available_hvac_mode_settings: ['off', 'cool', 'heat', 'heat_cool'],
      can_enable_automatic_cooling: true,
      can_enable_automatic_heating: true,
      is_cooling_available: true,
      is_heating_available: true,
      max_cooling_set_point_celsius: 33.333333333333336,
      max_heating_set_point_celsius: 26.11111111111111,
      min_cooling_set_point_celsius: 18.333333333333336,
      min_heating_set_point_celsius: 7.222222222222222,
      min_heating_cooling_delta_celsius: 2.7777777777777777,
      min_heating_cooling_delta_fahrenheit: 5,
      max_cooling_set_point_fahrenheit: 92,
      min_cooling_set_point_fahrenheit: 65,
      max_heating_set_point_fahrenheit: 79,
      min_heating_set_point_fahrenheit: 45,
      is_temporary_manual_override_active: false,
      name: 'debating book',
      image_url:
        'https://connect.getseam.com/assets/images/devices/ecobee_3-lite_front.png',
      image_alt_text: 'Placeholder Lock Image',
      is_climate_setting_schedule_active: false,
    },
    errors: [],
  })

  // add climate setting schedules
  db.addClimateSettingSchedule({
    device_id: device5.device_id,
    workspace_id: ws2.workspace_id,
    created_at: '2023-05-17T00:16:12.000',
    name: 'Guest - Robinson',
    schedule_starts_at: '2024-07-24T00:00:00.000Z',
    schedule_ends_at: '2024-08-01T00:00:00.000Z',
    schedule_type: 'time_bound',
    manual_override_allowed: true,
    automatic_heating_enabled: false,
    automatic_cooling_enabled: true,
    hvac_mode_setting: 'cool',
    cooling_set_point_fahrenheit: 70,
    cooling_set_point_celsius: 21,
  })

  db.addClimateSettingSchedule({
    device_id: device5.device_id,
    workspace_id: ws2.workspace_id,
    created_at: '2023-05-17T00:16:12.000',
    name: 'Guest - Cabrero',
    schedule_starts_at: '2024-07-04T00:00:00.000Z',
    schedule_ends_at: '2024-07-14T00:00:00.000Z',
    schedule_type: 'time_bound',
    manual_override_allowed: true,
    automatic_heating_enabled: true,
    automatic_cooling_enabled: true,
    hvac_mode_setting: 'heat_cool',
    heating_set_point_fahrenheit: 65,
    heating_set_point_celsius: 18,
    cooling_set_point_fahrenheit: 72,
    cooling_set_point_celsius: 22,
  })

  db.addClimateSettingSchedule({
    device_id: device5.device_id,
    workspace_id: ws2.workspace_id,
    created_at: '2022-05-17T00:16:12.000',
    name: 'Guest - Robinson with a very long title to test truncation and text wrap',
    schedule_starts_at: '2023-07-04T00:00:00.000Z',
    schedule_ends_at: '2027-08-14T00:00:00.000Z',
    schedule_type: 'time_bound',
    manual_override_allowed: true,
    automatic_heating_enabled: false,
    automatic_cooling_enabled: true,
    hvac_mode_setting: 'cool',
    cooling_set_point_fahrenheit: 72,
    cooling_set_point_celsius: 22.2222,
  })

  db.addClientSession({
    workspace_id: ws2.workspace_id,
    created_at: '2023-05-29T01:02:02.000',
    connect_webview_ids: [cw.connect_webview_id, cw2.connect_webview_id],
    connected_account_ids: [ca.connected_account_id, ca2.connected_account_id],
    user_identifier_key: fakeUserIdentifierKey,
    token: 'seam_cst1_0000',
    device1,
    device2,
    device3,
    device4,
    device5,
    device6,
  })
}
