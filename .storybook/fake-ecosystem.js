import { createHash } from 'node:crypto'
import { createServer } from 'node:http'

// A fake of the public Seam Ecosystem API (PartnerDB and DeviceDB) for Storybook and tests.
// It mirrors the routes, parameters, errors and declared-first support resolution of
// seamapi/ecosystem, with fictional partners and a small set of device models.
// Unlike the real API, /v1/compatibility always requires an embed key here,
// as if every caller were cross-origin.

export const fakeEmbedKey = 'eco_live_storybook'
export const fakePartnerEmbedKey = 'eco_live_storybook_partner'
export const fakeManufacturerEmbedKey = 'eco_live_storybook_schlage'
export const fakeWrongOriginEmbedKey = 'eco_live_storybook_wrong_origin'
export const fakeInvalidEmbedKey = 'eco_live_invalid'

const timestamp = '2026-10-01T00:00:00.000Z'

const uuid = (name) => {
  const hex = createHash('sha1').update(`fake-ecosystem:${name}`).digest('hex')
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `5${hex.slice(13, 16)}`,
    `a${hex.slice(17, 20)}`,
    hex.slice(20, 32),
  ].join('-')
}

// Taxonomy

const industries = {
  str: ['short-term-rental', 'Short-Term Rental', 'STR'],
  multifamily: ['multifamily', 'Multifamily', null],
  hospitality: ['hospitality', 'Hospitality', null],
  coworking: ['coworking', 'Coworking', null],
}

const solutions = {
  pms: ['property-management-system', 'Property Management System', 'PMS'],
  guest: ['guest-experience', 'Guest Experience', null],
  operations: ['operations', 'Operations', null],
  access: ['access-control', 'Access Control', null],
  energy: ['energy-management', 'Energy Management', null],
  noise: ['noise-monitoring', 'Noise Monitoring', null],
  operator: ['operator', 'Operator', null, 'service'],
}

const toIndustry = (key) => {
  const [slug, displayName, shortName] = industries[key]
  return {
    industry_id: uuid(`industry:${slug}`),
    slug,
    display_name: displayName,
    short_name: shortName,
  }
}

const toSolution = (key) => {
  const [slug, displayName, shortName, type = 'software'] = solutions[key]
  return {
    solution_id: uuid(`solution:${slug}`),
    slug,
    display_name: displayName,
    short_name: shortName,
    type,
  }
}

// Partners (PartnerDB): [category, manufacturer, provider, capability, declared_status, note]

const partners = [
  {
    slug: 'staypilot',
    name: 'StayPilot',
    color: '#2563eb',
    featured: true,
    industries: ['str'],
    solutions: ['pms'],
    support: [
      ['smartlock', '', '', '', 'enabled'],
      ['thermostat', '', '', '', 'enabled'],
      ['sensor', '', '', '', 'enabled'],
      [
        'smartlock',
        '',
        'salto-ks',
        'can_provision_mobile_keys',
        'disabled',
        'Mobile keys for Salto KS are on the StayPilot roadmap.',
      ],
    ],
  },
  {
    slug: 'hostly',
    name: 'Hostly',
    color: '#db2777',
    industries: ['str'],
    solutions: ['pms'],
    support: [
      ['smartlock', '', '', '', 'enabled'],
      ['thermostat', '', '', '', 'enabled'],
      ['smartlock', 'august', '', '', 'disabled'],
      ['smartlock', '', 'smart-things-cloud', '', 'not_via_seam'],
      [
        'smartlock',
        '',
        'salto-ks',
        'can_provision_mobile_keys',
        'disabled',
        'Hostly sends access codes instead of mobile keys.',
      ],
    ],
  },
  {
    slug: 'keyturn',
    name: 'Keyturn',
    color: '#0d9488',
    industries: ['str'],
    solutions: ['operator'],
    support: [
      ['smartlock', '', '', '', 'enabled'],
      [
        'smartlock',
        'schlage',
        '',
        '',
        'enabled',
        'Keyturn programs Schlage Encode codes for every reservation.',
      ],
    ],
  },
  {
    slug: 'nestwell',
    name: 'Nestwell',
    color: '#7c3aed',
    industries: ['str'],
    solutions: ['guest'],
    support: [
      ['thermostat', '', '', '', 'enabled'],
      ['sensor', '', '', '', 'enabled'],
    ],
  },
  {
    slug: 'thermostay',
    name: 'ThermoStay',
    color: '#ea580c',
    featured: true,
    industries: ['str'],
    solutions: ['energy'],
    support: [
      ['thermostat', '', '', '', 'enabled'],
      [
        'thermostat',
        '',
        '',
        'can_program_thermostat_weekly_programs',
        'enabled',
        'Pre-heats and pre-cools between stays.',
      ],
    ],
  },
  {
    slug: 'quietly',
    name: 'Quietly',
    color: '#475569',
    hasLogo: false,
    industries: ['str'],
    solutions: ['noise'],
    support: [['sensor', '', '', '', 'enabled']],
  },
  {
    slug: 'gatehouse',
    name: 'Gatehouse',
    color: '#16a34a',
    industries: ['multifamily'],
    solutions: ['access'],
    support: [
      ['smartlock', '', '', '', 'enabled'],
      ['intercom', '', '', '', 'enabled'],
      [
        'smartlock',
        '',
        'salto-ks',
        'can_provision_mobile_keys',
        'enabled',
        'Residents unlock Salto KS doors from the Gatehouse app.',
      ],
    ],
  },
  {
    slug: 'tenantry',
    name: 'Tenantry',
    color: '#9333ea',
    industries: ['multifamily'],
    solutions: ['pms'],
    support: [
      ['smartlock', '', '', '', 'enabled'],
      ['thermostat', '', '', '', 'enabled'],
      [
        'smartlock',
        '',
        'salto-ks',
        'can_provision_mobile_keys',
        'not_via_seam',
        'Tenantry uses its own Salto KS integration.',
      ],
    ],
  },
  {
    slug: 'roomsuite',
    name: 'Roomsuite',
    color: '#b45309',
    industries: ['hospitality'],
    solutions: ['pms'],
    support: [
      ['smartlock', '', '', '', 'enabled'],
      [
        'smartlock',
        '',
        'salto-ks',
        'can_provision_mobile_keys',
        'enabled',
        'Guests receive Salto KS mobile keys at check-in.',
      ],
    ],
  },
  {
    slug: 'deskdock',
    name: 'DeskDock',
    color: '#0284c7',
    industries: ['coworking'],
    solutions: ['access'],
    support: [
      ['smartlock', '', '', '', 'enabled'],
      ['smartlock', '', 'salto-ks', 'can_provision_mobile_keys', 'enabled'],
    ],
  },
  {
    slug: 'hearth-and-key',
    name: 'Hearth & Key',
    color: '#be123c',
    industries: ['str'],
    solutions: ['operator'],
    support: [
      ['smartlock', 'schlage', '', '', 'enabled'],
      ['smartlock', 'yale', '', '', 'enabled'],
    ],
  },
  {
    slug: 'parcelpoint',
    name: 'Parcelpoint',
    color: '#4d7c0f',
    industries: ['multifamily'],
    solutions: ['operations'],
    support: [
      ['smartlock', '', '', '', 'enabled'],
      ['intercom', '', '', '', 'enabled'],
    ],
  },
  {
    slug: 'cleanturn',
    name: 'CleanTurn',
    color: '#0891b2',
    industries: ['str'],
    solutions: ['operations'],
    support: [
      ['smartlock', '', '', '', 'enabled'],
      [
        'smartlock',
        'yale',
        '',
        '',
        'not_via_seam',
        'CleanTurn connects to Yale directly.',
      ],
    ],
  },
  {
    slug: 'brightside-suites',
    name: 'Brightside Suites',
    color: '#ca8a04',
    website: null,
    industries: ['hospitality'],
    solutions: ['guest'],
    support: [
      ['smartlock', '', '', '', 'enabled'],
      ['thermostat', '', '', '', 'enabled'],
    ],
  },
  {
    slug: 'lockbox-labs',
    name: 'Lockbox Labs',
    color: '#64748b',
    live: false,
    industries: ['str'],
    solutions: ['pms'],
    support: [['smartlock', '', '', '', 'enabled']],
  },
]

const levelOf = ([, manufacturer, provider, capability]) => {
  if (capability !== '') return 'capability'
  if (provider !== '') return 'provider'
  if (manufacturer !== '') return 'manufacturer'
  return 'device_category'
}

const toSupportRow = (partner, row) => {
  const [category, manufacturer, provider, capability, declared, note = null] =
    row
  return {
    partner_support_id: uuid(`support:${partner.slug}:${row.join(':')}`),
    partner_id: uuid(`partner:${partner.slug}`),
    level: levelOf(row),
    device_category: category,
    manufacturer_slug: manufacturer,
    provider_slug: provider,
    capability,
    observed_status: declared === 'enabled' ? 'active' : 'none',
    observed_metric: {},
    observed_at: timestamp,
    declared_status: declared,
    declared_by_actor_type: 'seam',
    declared_by_actor_id: null,
    declared_note: note,
    declared_at: timestamp,
  }
}

const toPartner = (partner, assetBaseUrl) => ({
  partner_id: uuid(`partner:${partner.slug}`),
  slug: partner.slug,
  display_name: partner.name,
  website:
    partner.website === undefined
      ? `https://${partner.slug}.example.com`
      : partner.website,
  description_md: `${partner.name} is a fictional Seam partner used in the Seam Components Storybook.`,
  is_live: partner.live ?? true,
  is_featured: partner.featured ?? false,
  legacy_industry_featured: false,
  industries: partner.industries.map(toIndustry),
  solutions: partner.solutions.map(toSolution),
  assets:
    partner.hasLogo === false
      ? []
      : [
          {
            partner_asset_id: uuid(`partner-asset:${partner.slug}`),
            kind: 'square_logo',
            url: `${assetBaseUrl}/assets/partner/${partner.slug}.svg`,
            mime: 'image/svg+xml',
            width: 64,
            height: 64,
            sort_order: 0,
          },
          {
            partner_asset_id: uuid(`partner-asset-mono:${partner.slug}`),
            kind: 'square_logo_mono',
            url: `${assetBaseUrl}/assets/partner-mono/${partner.slug}.svg`,
            mime: 'image/svg+xml',
            width: 64,
            height: 64,
            sort_order: 1,
          },
        ],
  created_at: timestamp,
  updated_at: timestamp,
})

// Declared-first resolution, ported from seamapi/ecosystem lib/support/support-matrix.ts.

const scopesToWalk = ({
  device_category: category,
  manufacturer_slug: m,
  provider_slug: p,
  capability: c,
}) => {
  const candidates = [
    [m, p, c],
    ['', p, c],
    [m, '', c],
    ['', '', c],
    [m, p, ''],
    ['', p, ''],
    [m, '', ''],
    ['', '', ''],
  ]
  const seen = new Set()
  const walk = []
  for (const [manufacturer, provider, capability] of candidates) {
    const key = `${manufacturer}|${provider}|${capability}`
    if (seen.has(key)) continue
    seen.add(key)
    walk.push({
      device_category: category,
      manufacturer_slug: manufacturer,
      provider_slug: provider,
      capability,
    })
  }
  return walk
}

const sameScope = (a, b) =>
  a.device_category === b.device_category &&
  a.manufacturer_slug === b.manufacturer_slug &&
  a.provider_slug === b.provider_slug &&
  a.capability === b.capability

const resolveSupport = (rows, query) => {
  const walk = scopesToWalk(query)
  for (const scope of walk) {
    const row = rows.find((r) => sameScope(r, scope))
    if (row?.declared_status != null) {
      return {
        supported: row.declared_status === 'enabled',
        resolved_level: row.level,
        declared_status: row.declared_status,
        observed_status: row.observed_status,
        note: row.declared_note,
      }
    }
  }
  const broadest = rows.find((r) => sameScope(r, walk.at(-1)))
  return {
    supported: false,
    resolved_level: null,
    declared_status: null,
    observed_status: broadest?.observed_status ?? null,
    note: null,
  }
}

const sortedUnique = (values) =>
  [...new Set(values)].sort((a, b) => a.localeCompare(b))

const excluding = new Set(['disabled', 'not_via_seam'])

const exclusionsFromSupportRows = (rows, capability) => {
  const capabilityExclusions = []
  if (capability !== '') {
    for (const category of sortedUnique(rows.map((r) => r.device_category))) {
      const inCategory = rows.filter((r) => r.device_category === category)
      const manufacturers = [
        '',
        ...sortedUnique(
          inCategory.map((r) => r.manufacturer_slug).filter((m) => m !== '')
        ),
      ]
      const providers = [
        '',
        ...sortedUnique(
          inCategory.map((r) => r.provider_slug).filter((p) => p !== '')
        ),
      ]
      for (const manufacturer of manufacturers) {
        for (const provider of providers) {
          const resolution = resolveSupport(inCategory, {
            device_category: category,
            manufacturer_slug: manufacturer,
            provider_slug: provider,
            capability,
          })
          if (
            resolution.resolved_level === 'capability' &&
            !resolution.supported
          ) {
            capabilityExclusions.push({
              device_category: category,
              manufacturer_slug: manufacturer,
              provider_slug: provider,
            })
          }
        }
      }
    }
  }
  const declaredExcluding = rows.filter((r) => excluding.has(r.declared_status))
  const at = (level, key) =>
    sortedUnique(
      declaredExcluding.filter((r) => r.level === level).map((r) => r[key])
    )
  return {
    excluded_manufacturers: at('manufacturer', 'manufacturer_slug'),
    excluded_device_types: at('device_category', 'device_category'),
    unsupported_providers: at('provider', 'provider_slug'),
    capability,
    capability_exclusions: capabilityExclusions,
  }
}

// Devices (DeviceDB)

const deviceTypes = {
  smartlock: ['Smartlock', false, 0],
  thermostat: ['Thermostat', false, 1],
  sensor: ['Sensor', false, 2],
  intercom: ['Intercom', false, 3],
  bridge: ['Bridge', true, 10],
  gateway: ['Gateway', true, 11],
}

const toDeviceTypeRef = (slug) => {
  const [displayName, isAccessory] = deviceTypes[slug]
  return {
    device_type_id: uuid(`device-type:${slug}`),
    slug,
    display_name: displayName,
    is_accessory: isAccessory,
  }
}

const providers = {
  schlage: 'Schlage Home',
  'schlage-engage': 'Schlage Engage',
  'smart-things-cloud': 'SmartThings Cloud',
  'yale-access': 'Yale Access (US)',
  'yale-home': 'Yale Home',
  'august-access': 'August Access',
  'salto-ks': 'Salto KS',
  'igloohome-api': 'igloohome API',
  ecobee: 'ecobee',
  'honeywell-resideo': 'Honeywell Resideo',
  'google-nest': 'Google Nest',
  minut: 'Minut',
  'noise-aware-api': 'NoiseAware API',
  '2n': '2N',
}

const toProviderRef = (slug) => ({
  provider_id: uuid(`provider:${slug}`),
  slug,
  display_name: providers[slug],
})

const capabilitiesByDeviceType = {
  smartlock: [
    'device_connectivity',
    'can_remotely_unlock',
    'can_remotely_lock',
    'can_program_online_access_codes',
    'can_program_offline_access_codes',
    'can_provision_mobile_keys',
    'can_provision_wallet_keys',
    'can_encode_plastic_cards',
  ],
  thermostat: [
    'device_connectivity',
    'can_hvac_heat',
    'can_hvac_cool',
    'can_hvac_auto',
    'can_hvac_fan',
    'can_program_thermostat_weekly_programs',
  ],
  sensor: ['device_connectivity', 'can_monitor'],
  intercom: [
    'device_connectivity',
    'can_remotely_unlock',
    'can_program_online_access_codes',
  ],
  bridge: ['device_connectivity'],
  gateway: ['device_connectivity'],
}

// Provider capability support: capability → 'yes' or [conditionally, details]. Others are 'no'.
const providerProfiles = {
  schlage: {
    device_connectivity: 'yes',
    can_remotely_unlock: 'yes',
    can_remotely_lock: 'yes',
    can_program_online_access_codes: 'yes',
  },
  'schlage-engage': {
    device_connectivity: [
      'conditionally',
      'Requires a Schlage Engage gateway.',
    ],
    can_remotely_unlock: 'yes',
    can_remotely_lock: 'yes',
    can_program_online_access_codes: [
      'conditionally',
      'Requires a Schlage Engage gateway.',
    ],
    can_provision_mobile_keys: 'yes',
    can_encode_plastic_cards: 'yes',
  },
  'smart-things-cloud': {
    device_connectivity: ['conditionally', 'Requires a SmartThings hub.'],
    can_remotely_unlock: ['conditionally', 'Requires a SmartThings hub.'],
    can_remotely_lock: ['conditionally', 'Requires a SmartThings hub.'],
    can_program_online_access_codes: [
      'conditionally',
      'Requires a SmartThings hub.',
    ],
  },
  'yale-access': {
    device_connectivity: 'yes',
    can_remotely_unlock: 'yes',
    can_remotely_lock: 'yes',
    can_program_online_access_codes: 'yes',
    can_program_offline_access_codes: 'yes',
  },
  'yale-home': {
    device_connectivity: 'yes',
    can_remotely_unlock: 'yes',
    can_remotely_lock: 'yes',
    can_program_online_access_codes: 'yes',
  },
  'august-access': {
    device_connectivity: [
      'conditionally',
      'Requires an August Connect bridge.',
    ],
    can_remotely_unlock: 'yes',
    can_remotely_lock: 'yes',
    can_program_online_access_codes: [
      'conditionally',
      'Requires an August keypad.',
    ],
  },
  'salto-ks': {
    device_connectivity: ['conditionally', 'Requires a Salto KS IQ gateway.'],
    can_remotely_unlock: 'yes',
    can_program_online_access_codes: [
      'conditionally',
      'Requires a keypad reader.',
    ],
    can_provision_mobile_keys: 'yes',
    can_provision_wallet_keys: [
      'conditionally',
      'Requires wallet key support on the lock.',
    ],
    can_encode_plastic_cards: 'yes',
  },
  'igloohome-api': {
    device_connectivity: ['conditionally', 'Requires an igloohome bridge.'],
    can_remotely_unlock: ['conditionally', 'Requires an igloohome bridge.'],
    can_program_offline_access_codes: 'yes',
  },
  ecobee: {
    device_connectivity: 'yes',
    can_hvac_heat: 'yes',
    can_hvac_cool: 'yes',
    can_hvac_auto: 'yes',
    can_hvac_fan: 'yes',
    can_program_thermostat_weekly_programs: 'yes',
  },
  'honeywell-resideo': {
    device_connectivity: 'yes',
    can_hvac_heat: 'yes',
    can_hvac_cool: 'yes',
    can_hvac_auto: 'yes',
    can_hvac_fan: 'yes',
  },
  'google-nest': {
    device_connectivity: 'yes',
    can_hvac_heat: 'yes',
    can_hvac_cool: 'yes',
    can_hvac_auto: 'yes',
    can_hvac_fan: ['conditionally', 'Requires a connected fan.'],
  },
  minut: { device_connectivity: 'yes', can_monitor: 'yes' },
  'noise-aware-api': { device_connectivity: 'yes', can_monitor: 'yes' },
  '2n': {
    device_connectivity: 'yes',
    can_remotely_unlock: 'yes',
    can_program_online_access_codes: 'yes',
  },
}

const manufacturers = [
  {
    slug: 'schlage',
    name: 'Schlage',
    color: '#c8102e',
    providers: ['schlage', 'schlage-engage', 'smart-things-cloud'],
  },
  {
    slug: 'yale',
    name: 'Yale',
    color: '#f5c400',
    text: '#111111',
    providers: ['yale-access', 'yale-home', 'smart-things-cloud'],
  },
  {
    slug: 'august',
    name: 'August',
    color: '#4a4a4a',
    providers: ['august-access'],
  },
  { slug: 'salto', name: 'Salto', color: '#0057b8', providers: ['salto-ks'] },
  {
    slug: 'igloohome',
    name: 'igloohome',
    color: '#00a3e0',
    providers: ['igloohome-api'],
  },
  { slug: 'ecobee', name: 'ecobee', color: '#2f9e44', providers: ['ecobee'] },
  {
    slug: 'honeywell',
    name: 'Honeywell',
    color: '#e4002b',
    providers: ['honeywell-resideo'],
  },
  {
    slug: 'google-nest',
    name: 'Google Nest',
    color: '#5f6368',
    providers: ['google-nest'],
  },
  { slug: 'minut', name: 'Minut', color: '#1f2937', providers: ['minut'] },
  {
    slug: 'noiseaware',
    name: 'NoiseAware',
    color: '#6d28d9',
    providers: ['noise-aware-api'],
  },
  { slug: '2n', name: '2N', color: '#00205b', providers: ['2n'] },
]

// [slug, name, manufacturer, device type, providers, model ids, options]
const deviceModels = [
  [
    'encode-plus-smart-wifi-deadbolt',
    'Encode Plus Smart WiFi Deadbolt',
    'schlage',
    'smartlock',
    ['schlage'],
    ['BE499WB'],
  ],
  [
    'encode-smart-wifi-deadbolt',
    'Encode Smart WiFi Deadbolt',
    'schlage',
    'smartlock',
    ['schlage'],
    ['BE489WB'],
  ],
  [
    'encode-smart-wifi-lever',
    'Encode Smart WiFi Lever',
    'schlage',
    'smartlock',
    ['schlage'],
    ['FE789WB'],
  ],
  [
    'control-smart-lock',
    'Control Smart Lock',
    'schlage',
    'smartlock',
    ['schlage-engage'],
    ['FE410F'],
  ],
  [
    'le-wireless-mortise-lock',
    'LE Wireless Mortise Lock',
    'schlage',
    'smartlock',
    ['schlage-engage'],
    ['LEMB'],
  ],
  [
    'connect-smart-deadbolt',
    'Connect Smart Deadbolt',
    'schlage',
    'smartlock',
    ['smart-things-cloud'],
    ['BE469ZP'],
  ],
  [
    'engage-gateway',
    'Engage Gateway',
    'schlage',
    'gateway',
    ['schlage-engage'],
    ['GWE'],
  ],
  [
    'schlage-internal-test-lock',
    'Internal Test Lock',
    'schlage',
    'smartlock',
    ['schlage'],
    [],
    { forbidden: true },
  ],
  [
    'assure-lock-2',
    'Assure Lock 2',
    'yale',
    'smartlock',
    ['yale-access'],
    ['YRD420'],
  ],
  [
    'assure-lock-2-touch',
    'Assure Lock 2 Touch',
    'yale',
    'smartlock',
    ['yale-access'],
    ['YRD450'],
  ],
  [
    'approach-lock',
    'Approach Lock',
    'yale',
    'smartlock',
    ['yale-access', 'yale-home'],
    ['YRD250'],
  ],
  [
    'linus-smart-lock-l2',
    'Linus Smart Lock L2',
    'yale',
    'smartlock',
    ['yale-home'],
    ['YDM4115A'],
  ],
  [
    'assure-lock-sl-z-wave',
    'Assure Lock SL (Z-Wave)',
    'yale',
    'smartlock',
    ['smart-things-cloud'],
    ['YRD256'],
  ],
  [
    'yale-connect-wifi-bridge',
    'Connect Wi-Fi Bridge',
    'yale',
    'bridge',
    ['yale-access'],
    ['AYR-CB'],
  ],
  [
    'wifi-smart-lock',
    'Wi-Fi Smart Lock',
    'august',
    'smartlock',
    ['august-access'],
    ['ASL-05'],
  ],
  [
    'smart-lock-pro',
    'Smart Lock Pro',
    'august',
    'smartlock',
    ['august-access'],
    ['ASL-03'],
  ],
  [
    'august-connect-wifi-bridge',
    'Connect Wi-Fi Bridge',
    'august',
    'bridge',
    ['august-access'],
    ['AC-R1'],
  ],
  ['xs4-one', 'XS4 One', 'salto', 'smartlock', ['salto-ks'], ['XS4ONE']],
  ['neo-cylinder', 'Neo Cylinder', 'salto', 'smartlock', ['salto-ks'], ['NEO']],
  ['xs4-mini', 'XS4 Mini', 'salto', 'smartlock', ['salto-ks'], ['XS4MINI']],
  ['ks-iq-gateway', 'KS IQ Gateway', 'salto', 'gateway', ['salto-ks'], ['IQ2']],
  [
    'smart-deadbolt-2s',
    'Smart Deadbolt 2S',
    'igloohome',
    'smartlock',
    ['igloohome-api'],
    ['IGM3'],
  ],
  [
    'keybox-3',
    'Keybox 3',
    'igloohome',
    'smartlock',
    ['igloohome-api'],
    ['IGK3'],
  ],
  [
    'smart-thermostat-premium',
    'Smart Thermostat Premium',
    'ecobee',
    'thermostat',
    ['ecobee'],
    ['EB-STATE6P-01'],
  ],
  [
    'smart-thermostat-enhanced',
    'Smart Thermostat Enhanced',
    'ecobee',
    'thermostat',
    ['ecobee'],
    ['EB-STATE6L-01'],
  ],
  [
    't6-pro-smart-thermostat',
    'T6 Pro Smart Thermostat',
    'honeywell',
    'thermostat',
    ['honeywell-resideo'],
    ['TH6220WF2006'],
  ],
  [
    't9-smart-thermostat',
    'T9 Smart Thermostat',
    'honeywell',
    'thermostat',
    ['honeywell-resideo'],
    ['RCHT9610WF'],
  ],
  [
    'nest-learning-thermostat',
    'Nest Learning Thermostat',
    'google-nest',
    'thermostat',
    ['google-nest'],
    ['GA02081'],
  ],
  [
    'nest-thermostat',
    'Nest Thermostat',
    'google-nest',
    'thermostat',
    ['google-nest'],
    ['GA01334'],
  ],
  [
    'minut-smart-home-sensor',
    'Minut Smart Home Sensor',
    'minut',
    'sensor',
    ['minut'],
    ['MT-03'],
  ],
  [
    'indoor-noise-sensor',
    'Indoor Noise Sensor',
    'noiseaware',
    'sensor',
    ['noise-aware-api'],
    ['NA-2'],
  ],
  ['ip-style', 'IP Style', '2n', 'intercom', ['2n'], ['9157101']],
  ['ip-verso', 'IP Verso', '2n', 'intercom', ['2n'], ['9155101']],
]

const toAsset = ({ kind, name, url, sortOrder = 0 }) => ({
  asset_id: uuid(`asset:${kind}:${name}`),
  kind,
  object_key: `fake/${kind}/${name}.svg`,
  url,
  mime: 'image/svg+xml',
  width: 64,
  height: 64,
  bytes: null,
  sha256: null,
  sort_order: sortOrder,
  formats: {},
  created_at: timestamp,
  updated_at: timestamp,
})

const toManufacturerRef = (slug) => {
  const manufacturer = manufacturers.find((m) => m.slug === slug)
  return {
    manufacturer_id: uuid(`manufacturer:${slug}`),
    slug,
    display_name: manufacturer?.name ?? null,
  }
}

const toCapability = (slug, providerSlug, name) => {
  const value = providerProfiles[providerSlug]?.[name] ?? 'no'
  const [supported, details] = Array.isArray(value) ? value : [value, null]
  const report =
    supported === 'no'
      ? { details: 'This system does not provide this capability.' }
      : { details: details ?? 'Supported through this system.' }
  return {
    capability_id: uuid(`capability:${slug}:${providerSlug}:${name}`),
    name,
    supported,
    integration_support_level: supported === 'no' ? 'unavailable' : 'stable',
    report,
    report_raw: report,
    locale: 'en',
    computed_at: timestamp,
  }
}

const toDeviceModel = (row, assetBaseUrl) => {
  const [
    slug,
    name,
    manufacturer,
    deviceType,
    providerSlugs,
    modelIds,
    options = {},
  ] = row
  return {
    device_model_id: uuid(`device-model:${slug}`),
    slug,
    display_name: name,
    description_md: null,
    product_url: `https://${manufacturer}.example.com/products/${slug}`,
    is_forbidden_to_3dparty: options.forbidden ?? false,
    no_longer_sold: false,
    shop_listings: null,
    last_commerce_search_at: null,
    manufacturer: toManufacturerRef(manufacturer),
    device_type: toDeviceTypeRef(deviceType),
    device_type_properties: null,
    variants: modelIds.map((modelId, index) => ({
      device_model_variant_id: uuid(`variant:${slug}:${modelId}`),
      color_name: null,
      style_name: null,
      primary_color_hex: null,
      manufacturer_model_id: modelId,
      asin: null,
      gtins: null,
      marketplace_listings: null,
      sort_order: index,
      images: [],
      created_at: timestamp,
      updated_at: timestamp,
    })),
    featured_image: toAsset({
      kind: 'featured',
      name: slug,
      url: `${assetBaseUrl}/assets/device/${deviceType}/${manufacturer}.svg`,
    }),
    providers: providerSlugs.map(toProviderRef),
    capabilities_by_provider: providerSlugs.map((providerSlug) => ({
      provider: toProviderRef(providerSlug),
      capabilities: capabilitiesByDeviceType[deviceType].map((capability) =>
        toCapability(slug, providerSlug, capability)
      ),
    })),
    capabilities_stale: false,
    created_at: timestamp,
    updated_at: timestamp,
  }
}

const toManufacturer = (manufacturer, assetBaseUrl) => {
  const types = [
    ...new Set(
      deviceModels.filter((m) => m[2] === manufacturer.slug).map((m) => m[3])
    ),
  ]
  return {
    manufacturer_id: uuid(`manufacturer:${manufacturer.slug}`),
    slug: manufacturer.slug,
    display_name: manufacturer.name,
    website: `https://${manufacturer.slug}.example.com`,
    headquarters: null,
    country_of_origin: null,
    parent_org: null,
    inc_date: null,
    customer_support_phone: null,
    customer_support_email: null,
    customer_support_url: null,
    description_md: null,
    seam_api_guide: null,
    commerce_footprint: null,
    last_commerce_search_at: null,
    logos: [
      toAsset({
        kind: 'square_logo',
        name: manufacturer.slug,
        url: `${assetBaseUrl}/assets/manufacturer/${manufacturer.slug}.svg`,
      }),
      toAsset({
        kind: 'square_logo_mono',
        name: manufacturer.slug,
        url: `${assetBaseUrl}/assets/manufacturer-mono/${manufacturer.slug}.svg`,
        sortOrder: 1,
      }),
    ],
    default_device_images: types.map((type) => ({
      device_type: toDeviceTypeRef(type),
      asset: toAsset({
        kind: 'default_device_image',
        name: `${manufacturer.slug}-${type}`,
        url: `${assetBaseUrl}/assets/device/${type}/${manufacturer.slug}.svg`,
      }),
    })),
    providers: manufacturer.providers.map(toProviderRef),
    device_model_count: deviceModels.filter((m) => m[2] === manufacturer.slug)
      .length,
    created_at: timestamp,
    updated_at: timestamp,
  }
}

// Embed keys

const embedKeys = {
  [fakeEmbedKey]: {
    display_name: 'Storybook',
    owner_kind: 'seam',
    partner: null,
    manufacturer_slug: null,
  },
  [fakePartnerEmbedKey]: {
    display_name: 'Hostly website',
    owner_kind: 'partner',
    partner: 'hostly',
    manufacturer_slug: null,
  },
  [fakeManufacturerEmbedKey]: {
    display_name: 'Schlage website',
    owner_kind: 'manufacturer',
    partner: null,
    manufacturer_slug: 'schlage',
  },
  [fakeWrongOriginEmbedKey]: {
    display_name: 'Wrong origin',
    owner_kind: 'seam',
    partner: null,
    manufacturer_slug: null,
    allowed_origins: ['https://example.com'],
  },
}

class FakeApiError extends Error {
  constructor(status, type, message, data) {
    super(message)
    this.status = status
    this.type = type
    this.data = data
  }
}

const requireEmbedKey = ({ headers, searchParams }) => {
  const key = searchParams.get('embed_key') ?? headers['x-embed-key'] ?? ''
  if (key.length === 0) {
    throw new FakeApiError(
      401,
      'embed_key_required',
      'Send the embed key as X-Embed-Key or embed_key'
    )
  }
  const embedKey = embedKeys[key]
  if (embedKey == null) {
    throw new FakeApiError(
      401,
      'invalid_embed_key',
      'Unknown or revoked embed key'
    )
  }
  if (key === fakeWrongOriginEmbedKey) {
    throw new FakeApiError(
      403,
      'origin_not_allowed',
      `Origin ${headers.origin ?? 'https://react.seam.co'} is not allowed for this key`
    )
  }
  return { key, ...embedKey }
}

const capabilityNames = new Set(Object.values(capabilitiesByDeviceType).flat())

const paginate = (items, searchParams) => {
  const limit = Math.min(
    Math.max(Number(searchParams.get('limit') ?? 100) || 100, 1),
    500
  )
  const cursor = searchParams.get('page_cursor')
  const sorted = [...items].sort((a, b) => a.slug.localeCompare(b.slug))
  const start = cursor == null ? 0 : sorted.findIndex((i) => i.slug > cursor)
  const page = start === -1 ? [] : sorted.slice(start, start + limit + 1)
  const hasNextPage = page.length > limit
  const items_ = page.slice(0, limit)
  return {
    items: items_,
    pagination: {
      has_next_page: hasNextPage,
      next_page_cursor: hasNextPage ? (items_.at(-1)?.slug ?? null) : null,
    },
  }
}

const listParam = (searchParams, key) =>
  searchParams
    .getAll(key)
    .flatMap((v) => v.split(','))
    .map((v) => v.trim())
    .filter((v) => v.length > 0)

const routes = {
  'v1/compatibility': ({ searchParams, headers, assetBaseUrl }) => {
    requireEmbedKey({ headers, searchParams })
    const category = searchParams.get('device_category') ?? ''
    if (!/^[a-z0-9_]+$/.test(category)) {
      throw new FakeApiError(
        400,
        'invalid_params',
        'Invalid request parameters'
      )
    }
    const query = {
      device_category: category,
      manufacturer_slug: searchParams.get('manufacturer_slug') ?? '',
      provider_slug: searchParams.get('provider_slug') ?? '',
      capability: searchParams.get('capability') ?? '',
    }
    const industry = searchParams.get('industry')
    const includeUnsupported =
      searchParams.get('include_unsupported') === 'true'
    const resolved = partners
      .filter((p) => p.live !== false)
      .filter(
        (p) =>
          industry == null ||
          p.industries.some((i) => industries[i][0] === industry)
      )
      .map((p) => ({
        ...toPartner(p, assetBaseUrl),
        support: resolveSupport(
          p.support
            .map((row) => toSupportRow(p, row))
            .filter((row) => row.device_category === category),
          query
        ),
      }))
    return {
      partners: includeUnsupported
        ? resolved
        : resolved.filter((p) => p.support.supported),
    }
  },

  'v1/device_models/list': ({ searchParams, assetBaseUrl }) => {
    const capability = searchParams.get('capability')
    if (capability != null && !capabilityNames.has(capability)) {
      throw new FakeApiError(
        400,
        'invalid_params',
        'Invalid request parameters'
      )
    }
    const slugs = listParam(searchParams, 'slugs')
    const manufacturer = searchParams.get('manufacturer')
    const deviceType = searchParams.get('device_type')
    const provider = searchParams.get('provider')
    const supported = searchParams.get('supported')
    const includeForbidden = searchParams.get('include_forbidden') === 'true'
    const isAccessory = searchParams.get('is_accessory')
    const models = deviceModels
      .map((row) => toDeviceModel(row, assetBaseUrl))
      .filter((m) => includeForbidden || m.is_forbidden_to_3dparty !== true)
      .filter((m) => slugs.length === 0 || slugs.includes(m.slug))
      .filter(
        (m) => manufacturer == null || m.manufacturer?.slug === manufacturer
      )
      .filter((m) => deviceType == null || m.device_type?.slug === deviceType)
      .filter(
        (m) => provider == null || m.providers.some((p) => p.slug === provider)
      )
      .filter(
        (m) =>
          isAccessory == null ||
          String(m.device_type?.is_accessory ?? false) === isAccessory
      )
      .filter(
        (m) =>
          capability == null ||
          m.capabilities_by_provider.some(({ capabilities }) =>
            capabilities.some(
              (c) =>
                c.name === capability &&
                (supported == null || c.supported === supported)
            )
          )
      )
    const { items, pagination } = paginate(models, searchParams)
    return { device_models: items, pagination }
  },

  'v1/manufacturers/list': ({ searchParams, assetBaseUrl }) => {
    const slugs = listParam(searchParams, 'slugs')
    const provider = searchParams.get('provider')
    const list = manufacturers
      .filter((m) => slugs.length === 0 || slugs.includes(m.slug))
      .filter((m) => provider == null || m.providers.includes(provider))
      .map((m) => toManufacturer(m, assetBaseUrl))
    const { items, pagination } = paginate(list, searchParams)
    return { manufacturers: items, pagination }
  },

  'v1/manufacturers/get': ({ searchParams, assetBaseUrl }) => {
    const slug = searchParams.get('slug')
    const manufacturerId = searchParams.get('manufacturer_id')
    if (slug == null && manufacturerId == null) {
      throw new FakeApiError(
        400,
        'missing_identifier',
        'Provide slug or manufacturer_id'
      )
    }
    const found = manufacturers.find(
      (m) =>
        m.slug === slug || uuid(`manufacturer:${m.slug}`) === manufacturerId
    )
    if (found == null) {
      throw new FakeApiError(
        404,
        'manufacturer_not_found',
        'Manufacturer not found'
      )
    }
    return { manufacturer: toManufacturer(found, assetBaseUrl) }
  },

  'v1/embed/resolve': ({ searchParams, headers }) => {
    const embedKey = requireEmbedKey({ headers, searchParams })
    const capability = searchParams.get('capability') ?? ''
    const partner = partners.find((p) => p.slug === embedKey.partner)
    const exclusions =
      partner == null
        ? {
            excluded_manufacturers: [],
            excluded_device_types: [],
            unsupported_providers: [],
            capability,
            capability_exclusions: [],
          }
        : exclusionsFromSupportRows(
            partner.support.map((row) => toSupportRow(partner, row)),
            capability
          )
    return {
      embed_key: {
        embed_key_id: uuid(`embed-key:${embedKey.key}`),
        display_name: embedKey.display_name,
        owner_kind: embedKey.owner_kind,
        partner_id: partner == null ? null : uuid(`partner:${partner.slug}`),
        manufacturer_slug: embedKey.manufacturer_slug,
        allowed_origins: embedKey.allowed_origins ?? [
          'https://react.seam.co',
          'http://localhost:*',
          'http://127.0.0.1:*',
        ],
        config: {},
        revoked_at: null,
        created_at: timestamp,
      },
      exclusions,
    }
  },
}

// Images

const escapeXml = (value) =>
  value.replace(/[<>&"']/g, (c) => `&#${c.charCodeAt(0)};`)

const initials = (name) =>
  name
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

const logoSvg = ({ name, color, text = '#ffffff', mono = false }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${
    mono ? '' : `<rect width="64" height="64" rx="14" fill="${color}"/>`
  }<text x="32" y="41" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" text-anchor="middle" fill="${
    mono ? '#ffffff' : text
  }">${escapeXml(initials(name))}</text></svg>`

const deviceShapes = {
  smartlock: (c) =>
    `<rect x="20" y="8" width="24" height="48" rx="8" fill="#f1f3f4" stroke="#9da1a9" stroke-width="2"/><circle cx="32" cy="22" r="5" fill="${c}"/><g fill="#9da1a9"><circle cx="27" cy="34" r="2"/><circle cx="37" cy="34" r="2"/><circle cx="27" cy="42" r="2"/><circle cx="37" cy="42" r="2"/></g>`,
  thermostat: (c) =>
    `<circle cx="32" cy="32" r="24" fill="#f1f3f4" stroke="#9da1a9" stroke-width="2"/><circle cx="32" cy="32" r="16" fill="none" stroke="${c}" stroke-width="4"/><text x="32" y="37" font-family="Arial, Helvetica, sans-serif" font-size="13" font-weight="700" text-anchor="middle" fill="#232b3a">72</text>`,
  sensor: (c) =>
    `<rect x="12" y="12" width="40" height="40" rx="12" fill="#f1f3f4" stroke="#9da1a9" stroke-width="2"/><g fill="none" stroke="${c}" stroke-width="3" stroke-linecap="round"><path d="M26 26a8 8 0 0 1 12 0"/><path d="M22 22a14 14 0 0 1 20 0"/></g><circle cx="32" cy="36" r="3" fill="${c}"/>`,
  intercom: (c) =>
    `<rect x="18" y="6" width="28" height="52" rx="6" fill="#f1f3f4" stroke="#9da1a9" stroke-width="2"/><rect x="24" y="12" width="16" height="12" rx="2" fill="#232b3a"/><g fill="#9da1a9"><rect x="24" y="30" width="16" height="2"/><rect x="24" y="35" width="16" height="2"/></g><circle cx="32" cy="47" r="4" fill="${c}"/>`,
  bridge: (c) =>
    `<rect x="14" y="22" width="36" height="28" rx="6" fill="#f1f3f4" stroke="#9da1a9" stroke-width="2"/><path d="M32 22V10" stroke="#9da1a9" stroke-width="2"/><circle cx="32" cy="9" r="3" fill="${c}"/><circle cx="32" cy="36" r="4" fill="${c}"/>`,
}
deviceShapes.gateway = deviceShapes.bridge

const deviceSvg = (type, color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${(
    deviceShapes[type] ?? deviceShapes.bridge
  )(color)}</svg>`

const getAsset = (path) => {
  const [, kind, ...rest] = path.split('/')
  const slug = rest.at(-1)?.replace(/\.svg$/, '') ?? ''
  if (kind === 'partner' || kind === 'partner-mono') {
    const partner = partners.find((p) => p.slug === slug)
    if (partner == null) return null
    return logoSvg({ ...partner, mono: kind === 'partner-mono' })
  }
  if (kind === 'manufacturer' || kind === 'manufacturer-mono') {
    const manufacturer = manufacturers.find((m) => m.slug === slug)
    if (manufacturer == null) return null
    return logoSvg({ ...manufacturer, mono: kind === 'manufacturer-mono' })
  }
  if (kind === 'device' && rest.length === 2) {
    const manufacturer = manufacturers.find((m) => m.slug === slug)
    return deviceSvg(rest[0], manufacturer?.color ?? '#007afc')
  }
  return null
}

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers':
    'Content-Type, Authorization, X-Actor-Id, X-Embed-Key, X-Library-Version',
}

/**
 * Handles one request to the fake Ecosystem API.
 * @param {{
 *   method: string,
 *   path: string,
 *   searchParams: URLSearchParams,
 *   headers: Record<string, string | undefined>,
 *   assetBaseUrl: string,
 * }} request
 * @returns {{ status: number, headers: Record<string, string>, body: string | null }}
 */
export const handleFakeEcosystemRequest = ({
  method,
  path,
  searchParams,
  headers,
  assetBaseUrl,
}) => {
  const normalizedPath = path.replace(/^\/+|\/+$/g, '')

  if (method === 'OPTIONS') {
    return {
      status: 204,
      headers: { ...corsHeaders, 'access-control-max-age': '86400' },
      body: null,
    }
  }

  if (normalizedPath.startsWith('assets/')) {
    const svg = getAsset(normalizedPath)
    if (svg == null) {
      return { status: 404, headers: corsHeaders, body: 'Not found' }
    }
    return {
      status: 200,
      headers: {
        ...corsHeaders,
        'content-type': 'image/svg+xml',
        'cache-control': 'public, max-age=86400',
      },
      body: svg,
    }
  }

  const json = (status, data) => ({
    status,
    headers: {
      ...corsHeaders,
      'content-type': 'application/json',
      'cache-control': 'no-store',
    },
    body: JSON.stringify(data),
  })

  const route = routes[normalizedPath]
  if (route == null) {
    return json(404, {
      ok: false,
      error: { type: 'not_found', message: 'Route not found' },
    })
  }

  if (method !== 'GET' && method !== 'HEAD') {
    return json(405, {
      ok: false,
      error: {
        type: 'method_not_allowed',
        message: `${method} is not allowed by the fake`,
      },
    })
  }

  try {
    return json(200, {
      ...route({ searchParams, headers, assetBaseUrl }),
      ok: true,
    })
  } catch (err) {
    if (err instanceof FakeApiError) {
      return json(err.status, {
        ok: false,
        error: {
          type: err.type,
          message: err.message,
          data: err.data,
          request_id: uuid(`request:${normalizedPath}`),
        },
      })
    }
    throw err
  }
}

const normalizeHeaders = (headers) =>
  Object.fromEntries(
    Object.entries(headers).map(([k, v]) => [
      k.toLowerCase(),
      Array.isArray(v) ? v.join(', ') : v,
    ])
  )

/**
 * Express or Node.js middleware serving the fake Ecosystem API.
 * Mount it on a path, e.g., `app.use('/api/ecosystem', middleware)`.
 * @param {{ assetBaseUrl: string }} options
 */
export const createFakeEcosystemMiddleware =
  ({ assetBaseUrl }) =>
  (req, res) => {
    const url = new URL(req.url ?? '/', 'http://fake-ecosystem.local')
    const { status, headers, body } = handleFakeEcosystemRequest({
      method: req.method ?? 'GET',
      path: url.pathname,
      searchParams: url.searchParams,
      headers: normalizeHeaders(req.headers),
      assetBaseUrl,
    })
    res.writeHead(status, headers)
    res.end(req.method === 'HEAD' ? undefined : (body ?? undefined))
  }

/**
 * Starts the fake Ecosystem API on a random local port.
 * @returns {Promise<{ endpoint: string, serverUrl: string, close: () => Promise<void> }>}
 */
export const startFakeEcosystemServer = async () => {
  let serverUrl = ''
  const server = createServer((req, res) => {
    createFakeEcosystemMiddleware({ assetBaseUrl: serverUrl })(req, res)
  })
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      resolve(undefined)
    })
  })
  const address = server.address()
  if (address == null || typeof address === 'string') {
    throw new Error('Fake Ecosystem server has no port')
  }
  serverUrl = `http://127.0.0.1:${address.port}`
  return {
    serverUrl,
    endpoint: `${serverUrl}/v1/`,
    close: async () => {
      await new Promise((resolve) => {
        server.close(() => {
          resolve(undefined)
        })
      })
    },
  }
}
