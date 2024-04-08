package com.helloIftekhar.springJwt.controller;

import com.helloIftekhar.springJwt.model.User;
import com.helloIftekhar.springJwt.service.JwtService;
import com.helloIftekhar.springJwt.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;




import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
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
            userInfo.put("role", user.getRole().toString()); // Assuming role is an enum

            return ResponseEntity.ok(userInfo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
