package com.ontech.OBS.auth;

import com.ontech.OBS.user.User;
import com.ontech.OBS.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;@Transactional
    public void activateUserAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setActivated(true);
        userRepository.save(user);

        // Send account activation confirmation email to the user
        emailService.sendAccountActivationConfirmation(user.getEmail());
    }
}
