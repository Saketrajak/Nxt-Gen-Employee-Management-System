package com.iaip.ems.service;

import com.iaip.ems.dto.AuthResponse;
import com.iaip.ems.dto.LoginRequest;
import com.iaip.ems.entity.User;
import com.iaip.ems.exception.ResourceNotFoundException;
import com.iaip.ems.repository.UserRepository;
import com.iaip.ems.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider,
            UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + request.getUsername()));

        Long empId = user.getEmployee() != null ? user.getEmployee().getId() : null;

        return new AuthResponse(jwt, user.getUsername(), user.getEmail(), user.getRole(), empId);
    }

    public AuthResponse getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new ResourceNotFoundException("No authenticated user found");
        }

        User user = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + auth.getName()));

        Long empId = user.getEmployee() != null ? user.getEmployee().getId() : null;

        return new AuthResponse(null, user.getUsername(), user.getEmail(), user.getRole(), empId);
    }
}
