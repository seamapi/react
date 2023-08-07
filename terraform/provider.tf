terraform {
  cloud {
    hostname     = "app.terraform.io"
    organization = "seamapi"
    workspaces {
      name = "react"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
