package com.VisualAlign.VisualAlign.service.impl;

import java.time.LocalDateTime;
import com.VisualAlign.VisualAlign.configuration.JwtProvider;
import java.util.Collection;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.VisualAlign.VisualAlign.configuration.JwtProvider;
import com.VisualAlign.VisualAlign.domain.UserRole;
import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.mapper.UserMapper;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.UserDto;
import com.VisualAlign.VisualAlign.payload.response.AuthResponse;
import com.VisualAlign.VisualAlign.repository.UserRepository;
import com.VisualAlign.VisualAlign.service.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceimplement implements AuthService {
    // Inject repository để đọc/ghi dữ liệu user trong database.
    private final UserRepository userRepository;
    // Dùng để mã hóa mật khẩu trước khi lưu.
    private final PasswordEncoder passwordEncoder;
    // Tạo JWT sau khi xác thực thành công.
    private final JwtProvider jwtProvider;
    // Service load user detail phục vụ quá trình xác thực.
    private final CustomerUserImplementation customerUserImplementation;

    @Override
    public AuthResponse register(UserDto userDto) {
        // Bước 1: Kiểm tra email đã tồn tại chưa.
        User user = userRepository.findByEmail(userDto.getEmail()).orElse(null);
        if (user != null) {
            AuthResponse response = new AuthResponse();
            response.setMessage("Email is already in use");
            return response;
        }

        // Bước 2: Chặn việc tự đăng ký tài khoản admin.
        if (userDto.getRole() == UserRole.ROLE_ADMIN) {
            AuthResponse response = new AuthResponse();
            response.setMessage("You cannot register as an admin");
            return response;
        }

        // Bước 3: Tạo đối tượng User entity mới từ dữ liệu đầu vào.
        User newUser = new User();
        newUser.setFullName(userDto.getFullName());
        newUser.setEmail(userDto.getEmail());
        newUser.setPassword(passwordEncoder.encode(userDto.getPassword()));
        newUser.setPhone(userDto.getPhone());
        newUser.setRole(userDto.getRole());
        newUser.setLastLogin(LocalDateTime.now());
        newUser.setCreatedAt(LocalDateTime.now());

        // Bước 4: Lưu user mới vào database.
        User savedUser = userRepository.save(newUser);

        // Bước 5: Tạo đối tượng Authentication từ userDetails.
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                customerUserImplementation.loadUserByUsername(savedUser.getEmail()),
                null,
                customerUserImplementation.loadUserByUsername(savedUser.getEmail()).getAuthorities());

        // Bước 6: Đặt Authentication vào SecurityContext cho request hiện tại.
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Bước 7: Tạo JWT dựa trên Authentication.
        String jwt = jwtProvider.generateToken(authentication);

        // Bước 8: Trả về response cho client.
        AuthResponse authResponse = new AuthResponse();
        authResponse.setMessage("Register successful");
        authResponse.setUser(UserMapper.toDto(savedUser));
        authResponse.setJwt(jwt);
        return authResponse;
    }

    @Override
    public AuthResponse login(UserDto userDto) {
        // Bước 1: Lấy thông tin đăng nhập từ request.
        String email = userDto.getEmail();
        String password = userDto.getPassword();

        // Bước 2: Xác thực email/password.
        Authentication authentication = authenticate(email, password);

        // Bước 3: Lưu trạng thái xác thực vào SecurityContext.
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Bước 4: Lấy danh sách quyền (roles/authorities) của user.
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();

        // Bước 5: Lấy role đầu tiên để xử lý logic phân quyền nếu cần.
        String role = authorities.iterator().next().getAuthority();

        // Bước 6: Tạo JWT trả về cho client.
        String jwt = jwtProvider.generateToken(authentication);

        // Bước 7: Cập nhật thời gian đăng nhập gần nhất.
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Bước 8: Đóng gói dữ liệu phản hồi login.
        AuthResponse authResponse = new AuthResponse();
        authResponse.setMessage("Login successful");
        authResponse.setUser(UserMapper.toDto(user));
        authResponse.setJwt(jwt);

        return authResponse;
    }

    private Authentication authenticate(String email, String password) {
        // Xác thực thông tin đăng nhập, trả về Authentication nếu hợp lệ
        UserDetails userDetails = customerUserImplementation.loadUserByUsername(email);
        if (userDetails == null) {
            throw new RuntimeException("email id not exist: " + email);
        }
        if (!passwordEncoder.matches(password, userDetails.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
