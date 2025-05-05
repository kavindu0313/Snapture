package com.photoshare.api.config;

import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;

/**
 * Configuration to enable DNS SRV resolution for MongoDB Atlas
 */
@Configuration
public class JvmDnsConfig {

    @PostConstruct
    public void init() {
        // Set JVM DNS cache TTL to 60 seconds (instead of default -1 which caches forever)
        java.security.Security.setProperty("networkaddress.cache.ttl", "60");
        // Enable DNS SRV resolution
        System.setProperty("jdk.tls.trustNameService", "true");
    }
}
