// UPSTREAM: Cannot set R2 custom domain via Terraform.
// https://github.com/cloudflare/terraform-provider-cloudflare/issues/2537
output "r2_custom_domain" {
  description = "Enable the custom domain for the R2 bucket manually."
  value = {
    zone_id = local.zone_id
    domain  = local.bucket_domain
    bucket  = cloudflare_r2_bucket.main.name
  }
}

output "vercel_rewrites" {
  description = "Set these rewrites in vercel.json."
  value = [
    {
      source      = "/v/:version/:asset*",
      destination = "https://${local.bucket_domain}/v/:version/:asset"
    },
  ]
}
