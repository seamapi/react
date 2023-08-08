// UPSTREAM: Cannot set R2 custom domain via Terraform.
// https://github.com/cloudflare/terraform-provider-cloudflare/issues/2537
output "r2_custom_domain" {
  description = "Enable the custom domain for the R2 bucket manually/"
  value = {
    zone_id = local.zone_id
    domain  = "${var.subdomain}.${var.zone_name}"
    bucket  = cloudflare_r2_bucket.main.name
  }
}
