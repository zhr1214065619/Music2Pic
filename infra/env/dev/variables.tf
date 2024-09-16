variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region to deploy the service"
  type        = string
  default     = "us-central1"
}

variable "service_name" {
  description = "The Cloud Run service name"
  type        = string
}

variable "image_url" {
  description = "The container image URL"
  type        = string
}
