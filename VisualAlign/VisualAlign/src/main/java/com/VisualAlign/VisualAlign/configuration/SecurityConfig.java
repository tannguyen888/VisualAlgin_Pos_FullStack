package com.VisualAlign.VisualAlign.configuration;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import jakarta.servlet.http.HttpServletRequest;

import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.service.UserService;
import com.VisualAlign.VisualAlign.service.CustomOAuth2User;
import com.VisualAlign.VisualAlign.service.impl.CustomOAuth2UserService;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final UserService userService;
    private final CustomOAuth2UserService oauthUserService;
    private final JwtProvider jwtProvider;

    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    // tách chuỗi "url1,url2" thành mảng String[]
    @Value("${app.cors.allowed-origins}")
    private String[] allowedOrigins;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED))

                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/", "/login", "/auth/**", "/oauth2/**", "/login/oauth2/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                        .requestMatchers("/auth/me").authenticated()
                        .requestMatchers("/api/super-admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/**").authenticated()
                        .anyRequest().permitAll())

                .oauth2Login(oauth -> oauth
                        .loginPage("/login")
                        .userInfoEndpoint(user -> user.userService(oauthUserService))
                        .successHandler((request, response, authentication) -> {

                            CustomOAuth2User oauthUser = (CustomOAuth2User) authentication.getPrincipal();
                            String email = oauthUser.getEmail();

                            User user = userService.processOAuthPostLogin(email, oauthUser.getName());
                            Authentication authToken = new UsernamePasswordAuthenticationToken(
                                    user.getEmail(),
                                    null,
                                    List.of(new SimpleGrantedAuthority(user.getRole().name())));

                            String jwt = jwtProvider.generateToken(authToken);

                            // redirect về FRONTEND kèm token (không redirect vào /home backend)
                            String redirectUrl = frontendBaseUrl + "/oauth-success?token=" + jwt;
                            response.sendRedirect(redirectUrl);
                        })
                        .failureHandler((request, response, expectation) -> {
                            String redirectUrl = frontendBaseUrl + "/login?error=oauth_failed";
                            response.sendRedirect(redirectUrl);
                        }))

                .addFilterBefore(new JwtValidator(), BasicAuthenticationFilter.class)
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .build();
    }

    private CorsConfigurationSource corsConfigurationSource() {
        return new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(Arrays.asList(allowedOrigins));
                configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                configuration.setAllowCredentials(true);
                configuration.setAllowedHeaders(
                        List.of("Authorization", "Content-Type", "Accept", "Origin", "X-Requested-With"));
                configuration.setMaxAge(3600L);
                return configuration;
            }
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}