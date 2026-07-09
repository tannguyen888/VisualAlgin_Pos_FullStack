package com.VisualAlign.VisualAlign.payload.dto;

import java.time.LocalDateTime;

import com.VisualAlign.VisualAlign.domain.UserRole;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Builder
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;

    private String fullName;

    private String email;

    private UserRole role;

    private String password;
    private String branch;
    private String phone;
    private Long branchId;
    private Long storeId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;

}
