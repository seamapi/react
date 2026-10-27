/**
 * Response types for the public Seam Ecosystem API (PartnerDB and DeviceDB).
 *
 * Hand-copied from the zod schemas in `seamapi/ecosystem` `public-types/`
 * (origin/main 055335c, 2026-10-17) to avoid a zod runtime dependency.
 * Fields stored verbatim from the source as JSON are typed as `unknown`.
 * Keep in sync with Ecosystem until it publishes its types as a package.
 */

// Partners (PartnerDB)

export interface EcosystemIndustry {
  industry_id: string
  slug: string
  display_name: string
  short_name: string | null
}

export interface EcosystemSolution {
  solution_id: string
  slug: string
  display_name: string
  short_name: string | null
  type: 'software' | 'service'
}

export type PartnerAssetKind =
  | 'square_logo'
  | 'square_logo_mono'
  | 'horizontal_logo'
  | 'horizontal_logo_mono'
  | 'product_image'

export interface PartnerAsset {
  partner_asset_id: string
  kind: PartnerAssetKind
  url: string
  mime: string
  width: number | null
  height: number | null
  sort_order: number
}

export interface Partner {
  partner_id: string
  slug: string
  display_name: string
  website: string | null
  description_md: string | null
  is_live: boolean
  is_featured: boolean
  legacy_industry_featured: boolean
  industries: EcosystemIndustry[]
  solutions: EcosystemSolution[]
  assets: PartnerAsset[]
  created_at: string
  updated_at: string
}

export type SupportLevel =
  | 'device_category'
  | 'manufacturer'
  | 'provider'
  | 'capability'

export type ObservedStatus = 'active' | 'trace' | 'none' | 'unknown'

export type DeclaredStatus = 'enabled' | 'disabled' | 'not_via_seam'

export interface SupportResolution {
  supported: boolean
  resolved_level: SupportLevel | null
  declared_status: DeclaredStatus | null
  observed_status: ObservedStatus | null
  note: string | null
}

export interface CompatiblePartner extends Partner {
  support: SupportResolution
}

// Embed keys

export type EmbedKeyOwnerKind = 'partner' | 'manufacturer' | 'seam'

/** The public record of an embed key, as returned by `embed/resolve`. */
export interface EmbedKey {
  embed_key_id: string
  display_name: string
  owner_kind: EmbedKeyOwnerKind
  partner_id: string | null
  manufacturer_slug: string | null
  allowed_origins: string[]
  config: Record<string, unknown>
  revoked_at: string | null
  created_at: string
}

export interface EmbedCapabilityExclusion {
  device_category: string
  /** Empty means every manufacturer in the category. */
  manufacturer_slug: string
  /** Empty means every provider in the category. */
  provider_slug: string
}

export interface EmbedExclusions {
  excluded_manufacturers: string[]
  excluded_device_types: string[]
  unsupported_providers: string[]
  capability: string
  capability_exclusions: EmbedCapabilityExclusion[]
}

/** The manufacturer a manufacturer-owned key scopes DeviceDB widgets to (DEVDB-439). */
export interface EmbedManufacturerContext {
  manufacturer_slug: string
}

export interface EmbedResolution {
  embed_key: EmbedKey
  /** Set for manufacturer-owned keys; null for partner and Seam keys. */
  manufacturer_context?: EmbedManufacturerContext | null
  exclusions: EmbedExclusions
}

// Devices (DeviceDB)

export interface MediaFormat {
  object_key: string
  url: string
  mime: string | null
  width: number | null
  height: number | null
  bytes: number | null
  sha256: string | null
}

export type MediaFormatName = 'thumbnail' | 'small' | 'medium' | 'large'

export type DeviceAssetKind =
  | 'square_logo'
  | 'square_logo_mono'
  | 'horizontal_logo'
  | 'horizontal_logo_mono'
  | 'default_device_image'
  | 'featured'
  | 'variant_image'

export interface DeviceAsset {
  asset_id: string
  kind: DeviceAssetKind
  object_key: string
  url: string
  mime: string | null
  width: number | null
  height: number | null
  bytes: number | null
  sha256: string | null
  sort_order: number
  formats: Partial<Record<MediaFormatName, MediaFormat>>
  created_at: string
  updated_at: string
}

export interface DeviceTypeRef {
  device_type_id: string
  slug: string
  display_name: string
  is_accessory: boolean
}

export interface ManufacturerRef {
  manufacturer_id: string
  slug: string
  display_name: string | null
}

export interface ProviderRef {
  provider_id: string
  slug: string
  display_name: string | null
}

/** Fields used from the public `providers/list` response to recover legacy report text. */
export interface ProviderRequirements extends ProviderRef {
  has_requirements: boolean | null
  requirements_md: string | null
}

export type CapabilityName =
  | 'device_connectivity'
  | 'can_program_online_access_codes'
  | 'can_program_offline_access_codes'
  | 'can_remotely_unlock'
  | 'can_remotely_lock'
  | 'can_encode_plastic_cards'
  | 'can_provision_mobile_keys'
  | 'can_provision_wallet_keys'
  | 'can_hvac_cool'
  | 'can_hvac_heat'
  | 'can_hvac_auto'
  | 'can_hvac_fan'
  | 'can_program_thermostat_weekly_programs'
  | 'can_monitor'

export type CapabilitySupported = 'yes' | 'no' | 'conditionally'

export type IntegrationSupportLevel =
  | 'inquire'
  | 'unavailable'
  | 'planned'
  | 'in-progress'
  | 'beta'
  | 'stable'

export interface CapabilityReport {
  details: string
  requirements?: Record<
    string,
    { message: string; device_slugs?: string[]; [key: string]: unknown }
  >
  dependencies?: string[]
  [key: string]: unknown
}

export interface CapabilityDetail {
  capability_id: string
  name: CapabilityName
  supported: CapabilitySupported
  integration_support_level: IntegrationSupportLevel | null
  report: CapabilityReport | null
  report_raw: CapabilityReport | null
  locale: string
  computed_at: string
}

export interface ProviderCapabilities {
  provider: ProviderRef
  capabilities: CapabilityDetail[]
}

export interface DeviceModelVariant {
  device_model_variant_id: string
  color_name: string | null
  style_name: string | null
  primary_color_hex: string | null
  manufacturer_model_id: string | null
  asin: string | null
  gtins: unknown
  marketplace_listings: unknown
  sort_order: number
  images: DeviceAsset[]
  created_at: string
  updated_at: string
}

export interface DeviceModel {
  device_model_id: string
  slug: string
  display_name: string | null
  description_md: string | null
  product_url: string | null
  is_forbidden_to_3dparty: boolean | null
  no_longer_sold: boolean | null
  shop_listings: unknown
  last_commerce_search_at: string | null
  manufacturer: ManufacturerRef | null
  device_type: DeviceTypeRef | null
  device_type_properties: unknown
  variants: DeviceModelVariant[]
  featured_image: DeviceAsset | null
  providers: ProviderRef[]
  capabilities_by_provider: ProviderCapabilities[]
  capabilities_stale: boolean
  created_at: string
  updated_at: string
}

// Device model summaries (`device_models/summaries/list`, DEVDB-437):
// the same models in a slim shape, without storage internals or commerce data.

export interface DeviceImageFormat {
  url: string
  width: number | null
  height: number | null
}

export interface DeviceImage {
  url: string
  mime: string | null
  width: number | null
  height: number | null
  formats: Partial<Record<MediaFormatName, DeviceImageFormat>>
}

export interface CapabilitySummary {
  name: CapabilityName
  supported: CapabilitySupported
  integration_support_level: IntegrationSupportLevel | null
  report: CapabilityReport | null
}

export interface DeviceModelSummaryVariant {
  device_model_variant_id: string
  color_name: string | null
  style_name: string | null
  primary_color_hex: string | null
  manufacturer_model_id: string | null
  images: DeviceImage[]
  /** Only with `include=commerce`. */
  asin?: string | null
  /** Only with `include=commerce`. */
  gtins?: unknown
  /** Only with `include=commerce`. */
  marketplace_listings?: unknown
}

export interface DeviceModelSummary {
  device_model_id: string
  slug: string
  display_name: string | null
  description_md: string | null
  product_url: string | null
  no_longer_sold: boolean | null
  is_forbidden_to_3dparty: boolean | null
  manufacturer: ManufacturerRef | null
  device_type: DeviceTypeRef | null
  device_type_properties: unknown
  featured_image: DeviceImage | null
  variants: DeviceModelSummaryVariant[]
  providers: ProviderRef[]
  capabilities_by_provider: Array<{
    provider: ProviderRef
    capabilities: CapabilitySummary[]
  }>
  capabilities_stale: boolean
  /** Only with `include=commerce`. */
  shop_listings?: unknown
  /** Only with `include=commerce`. */
  last_commerce_search_at?: string | null
  updated_at: string
}

export interface ManufacturerDefaultDeviceImage {
  device_type: DeviceTypeRef
  asset: DeviceAsset
}

export interface Manufacturer {
  manufacturer_id: string
  slug: string
  display_name: string | null
  website: string | null
  headquarters: string | null
  country_of_origin: string | null
  parent_org: string | null
  inc_date: string | null
  customer_support_phone: string | null
  customer_support_email: string | null
  customer_support_url: string | null
  description_md: string | null
  seam_api_guide: string | null
  commerce_footprint: unknown
  last_commerce_search_at: string | null
  logos: DeviceAsset[]
  default_device_images: ManufacturerDefaultDeviceImage[]
  providers: ProviderRef[]
  device_model_count: number
  created_at: string
  updated_at: string
}

export interface Pagination {
  has_next_page: boolean
  next_page_cursor: string | null
}

// Responses

export interface CompatibilityResponse {
  partners: CompatiblePartner[]
}

export interface DeviceModelsListResponse {
  device_models: DeviceModel[]
  pagination: Pagination
}

export interface DeviceModelSummariesListResponse {
  device_models: DeviceModelSummary[]
  pagination: Pagination
}

export interface ManufacturersListResponse {
  manufacturers: Manufacturer[]
  pagination: Pagination
}

export interface ProvidersListResponse {
  providers: ProviderRequirements[]
  pagination: Pagination
}

export interface EcosystemErrorResponse {
  ok: false
  error: {
    type: string
    message: string
    data?: Record<string, unknown>
    request_id?: string
  }
}
