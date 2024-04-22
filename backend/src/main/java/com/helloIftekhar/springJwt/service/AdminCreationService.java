package com.helloIftekhar.springJwt.service;

import com.helloIftekhar.springJwt.model.Role;
import com.helloIftekhar.springJwt.model.User;
import com.helloIftekhar.springJwt.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
public class AdminCreationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminCreationService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public boolean adminUserExists() {
        return userRepository.existsByUsername("admin");
    }

    public void createAdminUser() {
        if (!adminUserExists()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setStatus(true);
            admin.setFirstName("admin");
            admin.setLastName("admin");
            admin.setEmail("admin@admin.com");
            admin.setEmailVerified(true);
            admin.setPassword(passwordEncoder.encode("admin"));
            admin.setRole(Role.valueOf("ADMIN"));
            userRepository.save(admin);
        }
    }
}