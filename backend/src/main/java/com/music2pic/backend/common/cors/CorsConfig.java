package com.music2pic.backend.common.cors;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import lombok.Data;

/**
 * CORS設定クラス
 */
@Configuration
@ConfigurationProperties(prefix = "cors")
@Data
public class CorsConfig implements WebMvcConfigurer {

  /** CORSオリジン */
  private List<String> origins = new ArrayList<>();

  /** CORSメソッド */
  private List<String> methods = new ArrayList<>();

  /** 公開するレスポンスヘッダー */
  private List<String> exposedHeaders = new ArrayList<>();

  /** 許可リクエストヘッダー */
  private List<String> allowedHeaders = new ArrayList<>();

  /**
   * {@inheritDoc}
   */
  @Override
  public void addCorsMappings(@NonNull CorsRegistry registry) {
    registry.addMapping("/**").allowedOrigins(origins.toArray(String[]::new))
            .allowedMethods(methods.toArray(String[]::new)).allowCredentials(true)
            .allowedHeaders(allowedHeaders.toArray(String[]::new))
            .exposedHeaders(exposedHeaders.toArray(String[]::new));
  }

  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(origins);
    configuration.setAllowedMethods(methods);
    configuration.setAllowCredentials(true);
    configuration.setAllowedHeaders(allowedHeaders);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

}

