package com.music2pic.backend.common.configuration;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "google.normal")
@Data
public class NormalConfig {
  private String location;
  private String projectId;
}
