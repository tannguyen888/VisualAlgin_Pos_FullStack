package com.VisualAlign.VisualAlign.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.VisualAlign.VisualAlign.configuration.JwtProvider;
import com.VisualAlign.VisualAlign.domain.UserRole;
import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.modal.Provider;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.repository.UserRepository;
import com.VisualAlign.VisualAlign.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceimplement implements UserService {
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    private static final String OAUTH_PLACEHOLDER_PASSWORD = "{oauth-google-account}";
    private static final BCryptPasswordEncoder OAUTH_PASSWORD_ENCODER = new BCryptPasswordEncoder();

    @Override
    public User getUserFromJwttoken(String token) throws UserException {
        String email = jwtProvider.getEmailFromToken(token);
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            throw new UserException("User not found with email: " + email);
        }
        return user;

    }

    @Override
    public User getCurrentUser() throws UserException {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            throw new UserException("User not found with email: " + email);
        }
        return user;

    }

    @Override
    public User getUserByEmail(String email) throws UserException {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            throw new UserException("User not found with email: " + email);
        }
        return user;
    }

    @Override
    public User getUserById(Long id) throws UserException {
        User user = userRepository.findById(id).orElseThrow(
                () -> new UserException("User not found with id: " + id));

        return user;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User processOAuthPostLogin(String email, String name) {

        User existUser = userRepository.findByEmail(email)
                .orElse(null);

        if (existUser == null) {

            existUser = new User();
            existUser.setEmail(email);
            existUser.setFullName(name != null && !name.isBlank() ? name : email);
            // Keep DB-compatible non-null password for OAuth-only accounts.
            existUser.setPassword(OAUTH_PASSWORD_ENCODER.encode(OAUTH_PLACEHOLDER_PASSWORD));
            existUser.setProvider(Provider.GOOGLE.name());
            existUser.setRole(UserRole.ROLE_USER);
            existUser.setCreatedAt(LocalDateTime.now());
            existUser.setUpdatedAt(LocalDateTime.now());
            existUser.setLastLogin(LocalDateTime.now());

            userRepository.save(existUser);
        } else {
            String existingPassword = existUser.getPassword();
            if (existingPassword == null || existingPassword.isBlank()) {
                existUser.setPassword(OAUTH_PASSWORD_ENCODER.encode(OAUTH_PLACEHOLDER_PASSWORD));
            }
            existUser.setUpdatedAt(LocalDateTime.now());
            existUser.setLastLogin(LocalDateTime.now());
            userRepository.save(existUser);
        }

        return existUser;
    }
}