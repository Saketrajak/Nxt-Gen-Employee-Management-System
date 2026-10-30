package com.iaip.ems.config;

import com.iaip.ems.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class SecurityDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public SecurityDataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        userRepository.findByUsername("admin").ifPresent(user -> {
            user.setPasswordHash(passwordEncoder.encode("Admin@123"));
            userRepository.save(user);
        });

        userRepository.findByUsername("manager").ifPresent(user -> {
            user.setPasswordHash(passwordEncoder.encode("Manager@123"));
            userRepository.save(user);
        });

        userRepository.findByUsername("employee").ifPresent(user -> {
            user.setPasswordHash(passwordEncoder.encode("Employee@123"));
            userRepository.save(user);
        });
    }
}

