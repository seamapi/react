export interface DeviceModel {
  main_category: string
  model_name: string
  manufacturer_model_id: string
  connection_type: string
  support_level: 'Live' | 'Beta' | 'Unsupported'
  brand: string
  icon_url: string
  seam_device_model_page_url: string
}

export interface Filters {
  supportedOnly: boolean
}
