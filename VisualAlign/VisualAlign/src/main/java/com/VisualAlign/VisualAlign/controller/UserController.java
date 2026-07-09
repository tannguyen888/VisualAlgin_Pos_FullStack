package com.VisualAlign.VisualAlign.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.mapper.UserMapper;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.UserDto;
import com.VisualAlign.VisualAlign.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getUserProfile(@RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.getUserFromJwttoken(jwt);
        return ResponseEntity.ok(UserMapper.toDto(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id, @RequestHeader("Authorization") String jwt)
            throws UserException, Exception {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(UserMapper.toDto(user));
    }

    @GetMapping("/all")
    public ResponseEntity<List<UserDto>> getAllUsers(@RequestHeader("Authorization") String jwt) throws UserException {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users.stream().map(UserMapper::toDto).collect(Collectors.toList()));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserDto> getUserByEmail(@PathVariable String email,
            @RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(UserMapper.toDto(user));
    }

    @GetMapping("/current")
    public ResponseEntity<UserDto> getCurrentUser(@RequestHeader("Authorization") String jwt)
            throws UserException {
        User user = userService.getCurrentUser();
        return ResponseEntity.ok(UserMapper.toDto(user));
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("Test endpoint is working!");
    }
   
}
