package com.VisualAlign.VisualAlign.controller;

import com.VisualAlign.VisualAlign.service.AuthService;
import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.mapper.UserMapper;
import com.VisualAlign.VisualAlign.payload.dto.UserDto;
import com.VisualAlign.VisualAlign.payload.response.AuthResponse;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.repository.UserRepository;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService AuthService;
    private final UserRepository userRepository;
    

    public AuthController(AuthService AuthService, UserRepository userRepository) {
        this.AuthService = AuthService;
        this.userRepository = userRepository;
    }

    // localhost:5000/auth/register
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerHandler(@RequestBody UserDto userDto) throws UserException {
        AuthResponse authResponse = AuthService.register(userDto);
        return ResponseEntity.ok(authResponse);

    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody UserDto userDto) throws UserException {
        AuthResponse authResponse = AuthService.login(userDto);
        return ResponseEntity.ok(authResponse);

    }

    //health check 
      @GetMapping("/")
    public String home() {
        return "index";
    }

    @GetMapping("/home")
    @ResponseBody
    public String dashboard() {
        return "Login Successfully!";
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser(Authentication authentication) throws UserException {
         // principal lúc này là email (String), set bởi JwtValidator
    String email = authentication.getName();

    User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UserException("User not found"));

    return ResponseEntity.ok(UserMapper.toDto(user));
    }
}
