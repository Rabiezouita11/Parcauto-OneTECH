package com.helloIftekhar.springJwt.service;

import com.helloIftekhar.springJwt.model.User;
import com.helloIftekhar.springJwt.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import java.util.Optional;

@Service
@Transactional

public class UserService {
    @Autowired
    private JavaMailSender mailSender;
    private final UserRepository userRepository;

    @Async
    public  void sendEmail(SimpleMailMessage email) {
        mailSender.send(email);
    }
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public User getUserByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        return userOptional.orElse(null);
    }
    public  User findUserByEmail(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        return userOptional.orElse(null);
    }
    public void save(User User) {
        userRepository.save(User);
    }
    public User findUserByResetToken(String resetToken) {
        return userRepository.findByResetToken(resetToken).orElse(null);
    }
    public Optional<User> findById(Integer id) {
        return userRepository.findById(id);
    }

    public void updateUserProfile(Integer userId, String username, String firstName, String lastName ,String email ) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setUsername(username);
            user.setFirstName(firstName);
            user.setEmail(email);
            user.setLastName(lastName);
            userRepository.save(user);
        } else {
            // Handle the case where the user with the given ID is not found
        }
    }

}
