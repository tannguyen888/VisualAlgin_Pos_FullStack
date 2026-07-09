package com.VisualAlign.VisualAlign.configuration;

import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.crypto.SecretKey;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.util.stream.Collectors;

@Service
public class JwtProvider {
    static SecretKey key = Keys.hmacShaKeyFor(JwtConstant.SECRET_KEY.getBytes());
    // Phương thức để tạo JWT token từ Authentication object

    public static String generateToken(Authentication authentication) {
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        // lấy authorities từ Authentication

        String roles = populateAuthorities(authorities);
        return Jwts.builder()
                .issuedAt(new Date()) // cung cấp ngày đưa key
                .expiration(new Date(new Date().getTime() + 86400000)) // 24hrs expiration
                .claim("email", authentication.getName()) // lưu email vào claim
                .claim("authorities", roles) // lưu authorities vào claim
                .signWith(key) // ký token với secret key
                .compact(); // tạo token

    }

    private static String populateAuthorities(Collection<? extends GrantedAuthority> authorities) {
        Set<String> auths = new HashSet<>();
        // chuyển đổi authorities thành một chuỗi phân cách bằng dấu phẩy để lưu vào
        // claim
        for (GrantedAuthority authority : authorities) {
            auths.add(authority.getAuthority()); // lấy tên authority (ví dụ: ROLE_USER, ROLE_ADMIN)
            // và thêm vào set
        }
        return String.join(",", auths);
    }

    public String getEmailFromToken(String jwt) {
        jwt = jwt.substring(7); // bearer token sẽ bắt đầu bằng "Bearer ",
        // nên cần loại bỏ phần này để lấy token thực sự
        Claims claims = Jwts // cấu hình parser để xác thực token với secret key
                // và lấy claims từ token
                .parser() // tạo parser để phân tích token
                .verifyWith(key) // cấu hình parser để xác thực token với secret key
                .build() // xây dựng parser
                .parseSignedClaims(jwt) // phân tích token đã ký và lấy claims
                .getPayload(); // lấy payload (claims) từ token
        return String.valueOf(claims.get("email")); // trả về email từ claims

    }
}
