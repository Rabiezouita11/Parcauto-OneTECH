package com.helloIftekhar.springJwt.controller;

import com.helloIftekhar.springJwt.model.User;
import com.helloIftekhar.springJwt.service.JwtService;
import com.helloIftekhar.springJwt.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:4200")

public class UserController {
    private final JwtService jwtService;
    private final UserService userService; // Inject the UserService

    public UserController(JwtService jwtService, UserService userService) {
        this.jwtService = jwtService;
        this.userService = userService;
    }
    @GetMapping("/user")
    public ResponseEntity<Map<String, String>> getUserInfo(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.substring(7); // Remove "Bearer " prefix
        String username = jwtService.extractUsername(token);
        User user = userService.getUserByUsername(username);

        if (user != null) {
            // Create a Map to represent the user information
            Map<String, String> userInfo = new HashMap<>();
            userInfo.put("username", user.getUsername());
            userInfo.put("firstName", user.getFirstName());
            userInfo.put("lastName", user.getLastName());
            userInfo.put("image", user.getPhotos());
            userInfo.put("id", String.valueOf(user.getId()));
            userInfo.put("email", String.valueOf(user.getEmail()));

            userInfo.put("role", user.getRole().toString()); // Assuming role is an enum

            return ResponseEntity.ok(userInfo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PostMapping("/user/profile/update")
    public ResponseEntity<Object> updateProfile(@RequestBody User user) {
        // Extract user details from request
        Integer userId = user.getId();
        String username = user.getUsername();
        String firstName = user.getFirstName();
        String lastName = user.getLastName();
        String email = user.getEmail();

        // Assuming you have a method in your UserService to update the user profile
        userService.updateUserProfile(userId, username, firstName, lastName ,email);

        // Create a JSON object with a response message
        String message = "Profile updated successfully";
        Map<String, Object> response = new HashMap<>();
        response.put("message", message);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
