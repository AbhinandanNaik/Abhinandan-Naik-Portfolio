package com.abhinandan.portfolio.config;

import com.abhinandan.portfolio.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtFilter jwtFilter, CustomUserDetailsService userDetailsService) {
        this.jwtFilter = jwtFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow general actuator endpoints
                .requestMatchers("/actuator/**").permitAll()
                // H2 Console (for local development profile)
                .requestMatchers("/h2-console/**").permitAll()
                // Auth APIs
                .requestMatchers("/auth/**").permitAll()
                // Analytics submission & Contact
                .requestMatchers(HttpMethod.POST, "/contact").permitAll()
                .requestMatchers(HttpMethod.POST, "/analytics").permitAll()
                // AI Assistant
                .requestMatchers(HttpMethod.POST, "/ai/chat").permitAll()
                // Read-only APIs for portfolio contents
                .requestMatchers(HttpMethod.GET, "/projects/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/blogs/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/skills/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/experiences/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/certifications/**").permitAll()
                // Admin dashboard and modifications require ADMIN role
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/projects/**", "/blogs/**", "/skills/**", "/experiences/**", "/certifications/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/projects/**", "/blogs/**", "/skills/**", "/experiences/**", "/certifications/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/projects/**", "/blogs/**", "/skills/**", "/experiences/**", "/certifications/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        // Required to display H2-console inside iframe
        http.headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(Collections.singletonList("*")); // Support all origins (essential for dev environments)
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control", "Access-Control-Allow-Origin"));
        config.setExposedHeaders(Collections.singletonList("Authorization"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
