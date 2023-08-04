local {
  org = "seamapi"
  repo = "react"
  id = 0
}

resource "cloudflare_r2_bucket" "main" {
  name = join("-", [local.org, local.repo, local.id])
}
