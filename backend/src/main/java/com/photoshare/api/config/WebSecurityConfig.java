package com.photoshare.api.config;

import com.photoshare.api.security.JwtAuthenticationEntryPoint;
import com.photoshare.api.security.JwtRequestFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Security configuration for the application.
 * Note: WebSecurityConfigurerAdapter is deprecated in newer Spring versions but
 * still works.
 */
// @Configuration
// @EnableWebSecurity
// @EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    @org.springframework.context.annotation.Lazy
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Autowired
    @org.springframework.context.annotation.Lazy
    private UserDetailsService jwtUserDetailsService;

    @Autowired
    @org.springframework.context.annotation.Lazy
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        // Configure AuthenticationManager so that it knows from where to load
        // user for matching credentials
        auth.userDetailsService(jwtUserDetailsService).passwordEncoder(new BCryptPasswordEncoder());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        // We don't need CSRF for this example
        httpSecurity.cors().and().csrf().disable()
                // Don't authenticate these particular requests
                .authorizeRequests()
                .antMatchers("/auth/**").permitAll()
                // Allow all GET requests without authentication for development
                .antMatchers(HttpMethod.GET, "/**").permitAll()
                // Allow OPTIONS requests for CORS preflight
                .antMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .antMatchers("/posts/**").permitAll()
                .antMatchers("/users/**").permitAll()
                .antMatchers("/communities/**").permitAll()
                .antMatchers("/notifications/**").permitAll()
                .antMatchers("/authenticate").permitAll()
                .antMatchers("/register").permitAll()
                .antMatchers("/api/db-test/**").permitAll()
                .antMatchers("/api/health").permitAll()
                .antMatchers("/ws/**").permitAll()
                // All other requests need to be authenticated
                .anyRequest().authenticated().and()
                // Make sure we use stateless session; session won't be used to
                // store user's state.
                .exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint).and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // Add a filter to validate the tokens with every request
        httpSecurity.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    }
}
