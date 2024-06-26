package com.helloIftekhar.springJwt.repository;

import com.helloIftekhar.springJwt.model.Role;
import com.helloIftekhar.springJwt.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByResetToken(String resetToken); // New method to find user by reset token
    List<User> findByRoleIn(List<Role> roles);
    boolean existsByUsername(String username);
    Optional<User> findByResetTokenEmail(String resetTokenEmail);
    List<User> findByRoleAndStatus(Role role, boolean status);
    List<User> findByRole(String role);

}
