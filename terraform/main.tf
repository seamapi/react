locals {
  org  = "seamapi"
  repo = "react"
  id   = 0
}

data "cloudflare_zone" "main" {
  name = var.zone_name
}

locals {
  zone_id = data.cloudflare_zone.main.id
}

resource "cloudflare_r2_bucket" "main" {
  account_id = var.cloudflare_account_id
  name       = join("-", [local.org, local.repo, local.id])
  location   = "WNAM"
}
