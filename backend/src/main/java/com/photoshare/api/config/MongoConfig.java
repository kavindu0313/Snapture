package com.photoshare.api.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.MongoDatabaseFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoClientDatabaseFactory;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import java.util.concurrent.TimeUnit;

@Configuration
@EnableMongoRepositories(basePackages = "com.photoshare.api.repository")
public class MongoConfig {

    @Value("${spring.data.mongodb.uri}")
    private String connectionString;

    /**
     * Extract database name from connection string or use default
     */
    private String getDatabaseName() {
        if (connectionString != null && connectionString.contains("/")) {
            String[] parts = connectionString.split("/");
            String lastPart = parts[parts.length - 1];
            // Handle query parameters
            if (lastPart.contains("?")) {
                return lastPart.split("\\?")[0];
            }
            return lastPart;
        }
        return "photoshare";
    }

    @Bean
    public MongoClient mongoClient() {
        ConnectionString connString = new ConnectionString(connectionString);
        
        MongoClientSettings settings = MongoClientSettings.builder()
            .applyConnectionString(connString)
            .applyToSocketSettings(builder -> 
                builder.connectTimeout(10, TimeUnit.SECONDS)
                       .readTimeout(15, TimeUnit.SECONDS))
            .applyToConnectionPoolSettings(builder ->
                builder.maxWaitTime(20, TimeUnit.SECONDS)
                       .maxConnectionIdleTime(60, TimeUnit.SECONDS))
            // Only enable SSL for MongoDB Atlas connections
            .applyToSslSettings(builder -> 
                builder.enabled(connectionString.contains("mongodb+srv")))
            .build();
        
        return MongoClients.create(settings);
    }

    @Bean
    @Primary
    public MongoDatabaseFactory mongoDatabaseFactory() {
        return new SimpleMongoClientDatabaseFactory(mongoClient(), getDatabaseName());
    }

    @Bean
    @Primary
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoDatabaseFactory());
    }
}
