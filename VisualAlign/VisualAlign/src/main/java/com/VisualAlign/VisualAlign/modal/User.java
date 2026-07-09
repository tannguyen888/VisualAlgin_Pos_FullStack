package com.VisualAlign.VisualAlign.modal;

import java.time.LocalDateTime;

import com.VisualAlign.VisualAlign.domain.UserRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Email;
import org.springframework.lang.Nullable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Builder;

@Entity
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    @Email(message = "Email should be valid")
    private String email;

    @ManyToOne
    private Store store;

    @ManyToOne
    private Branch branch;
    @Nullable
    @Column(nullable = true)
    private String password;

    @Column(nullable = false)
    private UserRole role;

    @Column(nullable = true)
    private String provider;

    @Column(nullable = true)
    private String phone;

    @Column(nullable = true)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;

}
