package com.helloIftekhar.springJwt.controller;

import com.helloIftekhar.springJwt.model.AuthenticationResponse;
import com.helloIftekhar.springJwt.model.MessageResponse;
import com.helloIftekhar.springJwt.model.User;
import com.helloIftekhar.springJwt.service.AuthenticationService;
import com.helloIftekhar.springJwt.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Objects;
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
    public ResponseEntity<AuthenticationResponse> register(User request, @RequestParam(value = "image", required = false) MultipartFile multipartFile) throws IOException {
        // Pass both user request and multipart file to the service method
        return ResponseEntity.ok( authService.register(request, multipartFile));
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
    @GetMapping("/images/{userId}/{fileName}")
    public ResponseEntity<byte[]> getImage(@PathVariable Integer userId, @PathVariable String fileName) throws IOException {

        Optional<User> userOptional = userService.findById(userId);
        if (userOptional.isEmpty()) {
            String errorMessage = "User not found with ID: " + userId;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage.getBytes());
        }
        // Construct the path to the image file
        String filePath = "user-photos/" + userId + "/" + fileName;
        Path path = Paths.get(filePath);

        if (!Files.exists(path)) {
            String errorMessage = "Image not found for user ID: " + userId + " and file name: " + fileName;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage.getBytes());
        }

        // Read the image file as bytes
        byte[] imageData = Files.readAllBytes(path);

        // Set content type header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG); // Adjust content type as needed

        // Serve the image data as a response
        return ResponseEntity.ok().headers(headers).body(imageData);
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

    
    @PostMapping("/users/sendVerificationCode")
    public ResponseEntity<MessageResponse> sendVerificationCode(@RequestParam("email") String email, HttpServletRequest request) {
        Optional<User> userOptional = Optional.ofNullable(userService.findUserByEmail(email));

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found with email: " + email));
        }

        User user = userOptional.get();
        String appUrl = request.getScheme() + "://" + request.getServerName() + ":4200";

        // Generate a random verification code
        String verificationCode = generateVerificationCode();

        // Update user's verification code
        user.setVerificationCode(verificationCode);
        userService.save(user);

        // Send verification code to the user's email
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom("Parcauto-OneTECH");
        simpleMailMessage.setTo(user.getEmail());
        simpleMailMessage.setSubject("Email Verification Code");
        simpleMailMessage.setText("Your verification code is: " + verificationCode);

        userService.sendEmail(simpleMailMessage);

        return ResponseEntity.ok(new MessageResponse("Verification code sent to your email address"));
    }

    /**
     * Generate a random verification code.
     * @return the generated verification code
     */
    private String generateVerificationCode() {
        int length = 6; // Set the length of the verification code
        String chars = "0123456789"; // Define the characters to be used in the code

        StringBuilder verificationCode = new StringBuilder();
        for (int i = 0; i < length; i++) {
            int index = (int) (Math.random() * chars.length());
            verificationCode.append(chars.charAt(index));
        }
        return verificationCode.toString();
    }
    @PostMapping("/users/verifyCode")
    public ResponseEntity<MessageResponse> verifyCode(@RequestParam("email") String email, @RequestParam("code") String code) {
        Optional<User> userOptional = Optional.ofNullable(userService.findUserByEmail(email));

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found with email: " + email));
        }

        User user = userOptional.get();
        String verificationCode = user.getVerificationCode();

        if (verificationCode == null || !verificationCode.equals(code)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Incorrect verification code"));
        }

        // Update email status to valid
        user.setEmailVerified(true);
        userService.save(user);

        return ResponseEntity.ok(new MessageResponse("Email verification successful"));
    }


}
