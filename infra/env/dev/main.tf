provider "google" {
  project = var.project_id
  region  = var.region
}

module "cloud_run_service" {
  source      = "./cloud-run-module"
  project_id  = var.project_id
  region      = var.region
  service_name = var.service_name
  image_url   = var.image_url
}

output "cloud_run_service_url" {
  value = module.cloud_run_service.cloud_run_url
}