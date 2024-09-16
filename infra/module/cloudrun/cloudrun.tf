
# Google Cloud Service Account
resource "google_service_account" "cloud_run_service_account" {
  account_id   = "cloud-run-sa"
  display_name = "Cloud Run Service Account"
}

# Assign necessary permissions to the service account
resource "google_project_iam_member" "cloud_run_service_account_permissions" {
  project = var.project_id
  role    = "roles/run.admin"
  member  = "serviceAccount:${google_service_account.cloud_run_service_account.email}"
}

# Cloud Run service
resource "google_cloud_run_service" "default" {
  name     = var.service_name
  location = var.region

  template {
    spec {
      containers {
        image = var.image_url
        resources {
          limits = {
            cpu    = "1000m"
            memory = "512Mi"
          }
        }
      }
    }
  }
  autogenerate_revision_name = true
}

# Allow public access to Cloud Run service
resource "google_cloud_run_service_iam_policy" "noauth" {
  location    = google_cloud_run_service.default.location
  project     = var.project_id
  service     = google_cloud_run_service.default.name
  policy_data = data.google_iam_policy.cloud_run_noauth.policy_data
}

# IAM policy to allow unauthenticated access to Cloud Run
data "google_iam_policy" "cloud_run_noauth" {
  binding {
    role = "roles/run.invoker"

    members = [
      "allUsers",
    ]
  }
}

# Terraform output for the URL of the deployed service
output "cloud_run_url" {
  value = google_cloud_run_service.default.status[0].url
}
