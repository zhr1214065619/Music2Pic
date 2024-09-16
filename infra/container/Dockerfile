# Use an official Debian image as a base
FROM debian:bullseye-slim

# Install required packages (Nginx, OpenJDK 17, GCP CLI, curl)
RUN apt-get update && apt-get install -y \
    nginx \
    openjdk-17-jdk \
    curl \
    gnupg \
    ca-certificates \
    lsb-release \
    && rm -rf /var/lib/apt/lists/*

# Install Google Cloud CLI
RUN curl -sSL https://packages.cloud.google.com/apt/doc/apt-key.gpg | gpg --dearmor > /usr/share/keyrings/cloud.google.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | tee /etc/apt/sources.list.d/google-cloud-sdk.list \
    && apt-get update -y \
    && apt-get install -y google-cloud-sdk

# Set environment variables
ENV LOCATION=asia-northeast1 \
    PROJECT_ID=music2pic \
    GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/gcp_key.json

# Set environment variables for the app
ENV APP_HOME /usr/src/app
WORKDIR $APP_HOME

# Copy over the JAR file (assuming your JAR file is in the current directory)
COPY backend-0.0.1.jar $APP_HOME/app.jar

# Copy the GCP service account key (assuming it's in the current directory)
COPY gcp_key.json $APP_HOME/gcp_key.json

# Copy custom Nginx configuration to sites-available/default
COPY default /etc/nginx/sites-available/default

# Expose port 80 for Nginx
EXPOSE 80

# Start Nginx and the Java application
CMD ["sh", "-c", "service nginx start && java -jar app.jar"]
