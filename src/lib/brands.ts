export interface BrandInfo {
  readableName: string
  imageName: string
}

// Copied from 'lib/device/providers.ts' in
// 'seam-connect' on Jun 28th, 2023.
export const brands: Record<string, BrandInfo> = {
  akuvox: {
    readableName: 'Akuvox',
    imageName: 'akuvox_logo_square',
  },
  august: {
    readableName: 'August',
    imageName: 'august_logo_square',
  },
  avigilon_alta: {
    readableName: 'Avigilon Alta',
    imageName: 'avigilon_alta_logo_openpath_square',
  },
  brivo: {
    readableName: 'Brivo',
    imageName: 'brivo_logo_square',
  },
  butterflymx: {
    readableName: 'ButterflyMX',
    imageName: 'butterflymx_logo_square',
  },
  doorking: {
    readableName: 'Doorking',
    imageName: 'doorking_logo_square',
  },
  genie: {
    readableName: 'Genie',
    imageName: 'genie_logo_square',
  },
  igloo: {
    readableName: 'Igloo Developer',
    imageName: 'igloohome_logo_square',
  },
  igloohome: {
    readableName: 'Igloo Home',
    imageName: 'igloohome_logo_square',
  },
  kwikset: {
    readableName: 'Kwikset',
    imageName: 'kwikset_logo_square',
  },
  linear: {
    readableName: 'Linear',
    imageName: 'linear_logo_square',
  },
  lockly: {
    readableName: 'Lockly',
    imageName: 'lockly_logo_square',
  },
  ttlock: {
    readableName: 'TTLock',
    imageName: 'ttlock_logo_square',
  },
  noiseaware: {
    readableName: 'Noiseaware',
    imageName: 'noiseaware_logo_square',
  },
  nuki: {
    readableName: 'Nuki',
    imageName: 'nuki_logo_square',
  },
  salto: {
    readableName: 'Salto',
    imageName: 'salto_logo_square',
  },
  schlage: {
    readableName: 'Schlage',
    imageName: 'schlage_logo_square',
  },
  seam_relay_admin: {
    readableName: 'Seam',
    imageName: 'seam',
  },
  smartthings: {
    readableName: 'SmartThings',
    imageName: 'smartthings_logo_square',
  },
  yale: {
    readableName: 'Yale',
    imageName: 'yale_logo_square',
  },
  minut: {
    readableName: 'Minut',
    imageName: 'minut_logo_wordmark',
  },
  my_2n: {
    readableName: 'My2N',
    imageName: '2n_logo_square',
  },
  controlbyweb: {
    readableName: 'ControlByWeb',
    imageName: 'controlbyweb_logo_square',
  },
  nest: {
    readableName: 'Google Nest',
    imageName: 'nest_logo_square',
  },
  ecobee: {
    readableName: 'Ecobee',
    imageName: 'ecobee_logo_square',
  },
}

export function getBrandInfo(brand: string): BrandInfo {
  const info = brands[brand]
  if (info == null) {
    // Fallback for unknown brands
    return {
      readableName: 'Unknown',
      imageName: 'seam',
    }
  }

  return info
}

export function getImage(brandInfo: BrandInfo): string {
  return `https://connect.getseam.com/assets/images/logos/${brandInfo.imageName}.png`
}
