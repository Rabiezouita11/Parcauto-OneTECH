package com.helloIftekhar.springJwt.controller;

import com.helloIftekhar.springJwt.model.AuthenticationResponse;
import com.helloIftekhar.springJwt.model.MessageResponse;
import com.helloIftekhar.springJwt.model.User;
import com.helloIftekhar.springJwt.service.AuthenticationService;
import com.helloIftekhar.springJwt.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin(origins = "http://localhost:4200") // Add this annotation to allow requests from specific origin

@RestController
public class AuthenticationController {
    private final UserService userService; // Inject the UserService
    private static final long EXPIRE_TOKEN_AFTER_MINUTES = 30;
    @Autowired
    PasswordEncoder passwordEncoder; // Add this import
    private final AuthenticationService authService;

    public AuthenticationController(UserService userService, AuthenticationService authService) {
        this.userService = userService;
        this.authService = authService;
    }


    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody User request
            ) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(
            @RequestBody User request
    ) {
        return ResponseEntity.ok(authService.authenticate(request));
    }

    @GetMapping("/users/verif/{email}")
    public ResponseEntity<MessageResponse> findUserByEmail(@PathVariable String email, HttpServletRequest request) {
            Optional<User> user = Optional.ofNullable(userService.findUserByEmail(email));
        String appUrl = request.getScheme() + "://" + request.getServerName() + ":4200";
        if (user.isEmpty()) {
            System.out.println("We didn't find an account for that e-mail address.");
            return ResponseEntity.badRequest().body(new MessageResponse("We didn't find an account for that e-mail address"));

        } else {
            User userr = user.get();

            userr.setDateToken(LocalDateTime.now());
            userr.setResetToken(UUID.randomUUID().toString());
            userService.save(userr);
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setFrom("Parcauto-OneTECH");
            simpleMailMessage.setTo(userr.getEmail());
            simpleMailMessage.setSubject("Password Reset Request");
            simpleMailMessage.setText("Pou récupérer votre Mot De passe cliquer sur ce Lien :\n" + appUrl
                    + "/auth/resetpassword?token=" + userr.getResetToken());
            System.out.println(userr.getResetToken());
            userService.sendEmail(simpleMailMessage);
            return ResponseEntity.ok(new MessageResponse("Password reset link has been sent to your email address"));

        }
    }


    @GetMapping("/users/rest/{resetToken}/{password}")
    public ResponseEntity<MessageResponse> findUserByResetToken(@PathVariable String resetToken, @PathVariable String password) {
        System.out.println(password);

        Optional<User> user = Optional.ofNullable(userService.findUserByResetToken(resetToken));
        if (!user.isPresent()) {
            System.out.println("We didn't find an account for that Token");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("We didn't find an account for that Token"));


        } else {
            User userr = user.get();
            LocalDateTime tokenCreationDate = userr.getDateToken();

            if (isTokenExpired(tokenCreationDate)) {
                System.out.println("Token expired.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Token expired"));

            }
            String encodedPassword = passwordEncoder.encode(password);


            userr.setPassword(encodedPassword);
            userr.setResetToken(null);
            userr.setDateToken(null);
            userService.save(userr);

            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Password reset successful"));

        }
    }
    /**
     * Check whether the created token expired or not.
     *
     * @param tokenCreationDate
     * @return true or false
     */
    private boolean isTokenExpired(final LocalDateTime tokenCreationDate) {

        LocalDateTime now = LocalDateTime.now();
        Duration diff = Duration.between(tokenCreationDate, now);

        return diff.toMinutes() >= EXPIRE_TOKEN_AFTER_MINUTES;
    }
}
