package com.abhinandan.portfolio.controller;

import com.abhinandan.portfolio.config.JwtUtils;
import com.abhinandan.portfolio.dto.JwtResponse;
import com.abhinandan.portfolio.dto.LoginRequest;
import com.abhinandan.portfolio.dto.MessageResponse;
import com.abhinandan.portfolio.dto.RefreshTokenRequest;
import com.abhinandan.portfolio.service.CustomUserDetailsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService userDetailsService;

    public AuthController(AuthenticationManager authenticationManager, JwtUtils jwtUtils, CustomUserDetailsService userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        String jwt = jwtUtils.generateToken(userDetails);
        String refreshToken = jwtUtils.generateRefreshToken(userDetails);

        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_VISITOR")
                .replace("ROLE_", "");

        return ResponseEntity.ok(JwtResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken)
                .username(userDetails.getUsername())
                .role(role)
                .build());
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest refreshRequest) {
        String refreshToken = refreshRequest.getRefreshToken();
        try {
            String username = jwtUtils.extractUsername(refreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtUtils.validateToken(refreshToken, userDetails)) {
                String newAccessToken = jwtUtils.generateToken(userDetails);
                String role = userDetails.getAuthorities().stream()
                        .map(GrantedAuthority::getAuthority)
                        .findFirst()
                        .orElse("ROLE_VISITOR")
                        .replace("ROLE_", "");

                return ResponseEntity.ok(JwtResponse.builder()
                        .accessToken(newAccessToken)
                        .refreshToken(refreshToken)
                        .username(userDetails.getUsername())
                        .role(role)
                        .build());
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid refresh token"));
        }
        return ResponseEntity.badRequest().body(new MessageResponse("Invalid refresh token"));
    }
}
