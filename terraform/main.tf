locals {
  org  = "seamapi"
  repo = "react"
  id   = 0
}

resource "cloudflare_r2_bucket" "main" {
  account_id = var.cloudflare_account_id
  name       = join("-", [local.org, local.repo, local.id])
}
