package com.helloIftekhar.springJwt.controller;

import com.helloIftekhar.springJwt.model.AuthenticationResponse;
import com.helloIftekhar.springJwt.model.MessageResponse;
import com.helloIftekhar.springJwt.model.User;
import com.helloIftekhar.springJwt.repository.ReservationRepository;
import com.helloIftekhar.springJwt.repository.TokenRepository;
import com.helloIftekhar.springJwt.repository.UserRepository;
import com.helloIftekhar.springJwt.service.AuthenticationService;
import com.helloIftekhar.springJwt.service.JwtService;
import com.helloIftekhar.springJwt.service.UserService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;
@CrossOrigin(origins = "http://localhost:4200") // Add this annotation to allow requests from specific origin

@RestController
public class AuthenticationController {


    private final UserService userService; // Inject the UserService
    private static final long EXPIRE_TOKEN_AFTER_MINUTES = 30;
    @Autowired
    PasswordEncoder passwordEncoder; // Add this import
    private final AuthenticationService authService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenRepository tokenRepository;
    @Autowired
    private ReservationRepository reservationRepository; // Autowire ReservationRepository
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
            return ResponseEntity.badRequest().body(new MessageResponse("Nous n'avons trouvé aucun compte pour cette adresse e-mail"));
        } else {
            User userr = user.get();

            userr.setDateToken(LocalDateTime.now());
            userr.setResetToken(UUID.randomUUID().toString());
            userService.save(userr);
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setFrom("Parcauto-OneTECH");
            simpleMailMessage.setTo(userr.getEmail());
            simpleMailMessage.setSubject("Demande de réinitialisation de mot de passe");
            simpleMailMessage.setText("Pour réinitialiser votre mot de passe, cliquez sur ce lien :\n" + appUrl + "/auth/resetpassword?token=" + userr.getResetToken());

            System.out.println(userr.getResetToken());
            userService.sendEmail(simpleMailMessage);
            return ResponseEntity.ok(new MessageResponse("Le lien de réinitialisation de mot de passe a été envoyé à votre adresse e-mail"));

        }
    }


    @GetMapping("/users/rest/{resetToken}/{password}")
    public ResponseEntity<MessageResponse> findUserByResetToken(@PathVariable String resetToken, @PathVariable String password) {
        System.out.println(password);

        Optional<User> user = Optional.ofNullable(userService.findUserByResetToken(resetToken));
        if (!user.isPresent()) {
            System.out.println("We didn't find an account for that Token");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponse("Nous n'avons trouvé aucun compte pour ce jeton"));


        } else {
            User userr = user.get();
            LocalDateTime tokenCreationDate = userr.getDateToken();

            if (isTokenExpired(tokenCreationDate)) {
                System.out.println("Token expired.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponse("Le jeton a expiré"));

            }
            String encodedPassword = passwordEncoder.encode(password);


            userr.setPassword(encodedPassword);
            userr.setResetToken(null);
            userr.setDateToken(null);
            userService.save(userr);

            return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse("Réinitialisation de mot de passe réussie"));

        }
    }
    @GetMapping("/images/{userId}/{fileName}")
    public ResponseEntity<byte[]> getImage(@PathVariable Integer userId, @PathVariable String fileName) throws IOException {

        Optional<User> userOptional = userService.findById(userId);
        if (userOptional.isEmpty()) {
            String errorMessage = "Utilisateur non trouvé avec l'ID : " + userId;
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage.getBytes());
        }
        // Construct the path to the image file
        String filePath = "user-photos/" + userId + "/" + fileName;
        Path path = Paths.get(filePath);

        if (!Files.exists(path)) {
            String errorMessage = "Image non trouvée pour l'ID utilisateur : " + userId + " et le nom de fichier : " + fileName;
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
            return ResponseEntity.badRequest().body(new MessageResponse("Utilisateur non trouvé avec l'email : " + email));
        }

        User user = userOptional.get();
        String appUrl = request.getScheme() + "://" + request.getServerName() + ":4200";

        // Generate a random verification code
        String verificationCode = generateVerificationCode();

        // Generate token using username
        String token = generateTokenForUsername(user.getUsername());

        // Update user's verification code and reset token
        user.setVerificationCode(verificationCode);
        user.setResetTokenEmail(token);
        userService.save(user);

        // Send verification code to the user's email
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setFrom("Parcauto-OneTECH");
        simpleMailMessage.setTo(user.getEmail());
        simpleMailMessage.setSubject("Code de vérification par email");
        simpleMailMessage.setText("Votre code de vérification est : " + verificationCode +
                "\n\nPour vérifier votre email, veuillez cliquer sur le lien suivant :\n" +
                appUrl + "/auth/verification?token=" + token);


        userService.sendEmail(simpleMailMessage);

        return ResponseEntity.ok(new MessageResponse("Code de vérification envoyé à votre adresse e-mail"));
    }

    private String generateTokenForUsername(String username) {
        // Your token generation logic here
        // For example, using JWT
        Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        long expirationTimeInMs = 3600000; // 1 hour expiration time

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTimeInMs);

        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();

        return token;
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
    public ResponseEntity<MessageResponse> verifyCode(@RequestParam("token") String token,
                                                      @RequestParam("code") String code) {
        System.out.println("tokentokentokentokentoken"+token);
        Optional<User> userOptional = Optional.ofNullable(userService.findUserByResetTokenEmail(token));

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(new MessageResponse("Utilisateur non trouvé avec le jeton de réinitialisation : " + token));
        }

        User user = userOptional.get();
        String verificationCode = user.getVerificationCode();

        if (verificationCode == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Le code de vérification n'existe pas"));
        }

        if (!verificationCode.equals(code)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Code de vérification incorrect"));
        }

        // Update email status to valid
        user.setEmailVerified(true);
        user.setResetTokenEmail(null);
        user.setVerificationCode(null);
        userService.save(user);

        return ResponseEntity.ok(new MessageResponse("Vérification de l'email réussie"));
    }

    @DeleteMapping("/delete/{id}")
    @Transactional // Ensure that the transaction is properly managed
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        try {
            // Delete associated tokens first
            tokenRepository.deleteByUserId(Long.valueOf(id)); // Assuming you have a method to delete tokens by user ID
            reservationRepository.deleteByUser_Id(Long.valueOf(id)); // Assuming you have a method to delete reservations by user ID

            // Then delete the user
            userRepository.deleteById(id);

            // Return success message
            return ResponseEntity.ok().body("{\"message\": \"User deleted successfully\"}");
        } catch (Exception e) {
            // Return error message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("{\"error\": \"Error deleting user: " + e.getMessage() + "\"}");
        }
    }


}




