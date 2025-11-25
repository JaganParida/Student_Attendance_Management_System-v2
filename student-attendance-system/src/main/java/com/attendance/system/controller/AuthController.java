package com.attendance.system.controller;

import com.attendance.system.dto.request.LoginRequest;
import com.attendance.system.dto.request.SignupRequest;
import com.attendance.system.dto.response.JwtResponse;
import com.attendance.system.dto.response.UserInfoResponse;
import com.attendance.system.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/auth") // <-- FIXED
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse jwtResponse = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
        	e.printStackTrace(); 
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            UserInfoResponse response = authService.registerUser(signUpRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).body("Not authenticated");
            }

            Object principal = authentication.getPrincipal();
            if (principal instanceof com.attendance.system.service.impl.UserDetailsServiceImpl.UserDetailsImpl userDetails) {
                Long userId = userDetails.getId();
                UserInfoResponse userInfo = authService.getCurrentUserInfo(userId);
                return ResponseEntity.ok(userInfo);
            } else {
                return ResponseEntity.status(401).body("Invalid authentication");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
