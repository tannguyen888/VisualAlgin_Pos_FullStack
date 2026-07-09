package com.VisualAlign.VisualAlign.payload.response;

import com.VisualAlign.VisualAlign.payload.dto.UserDto;

import lombok.Data;

@Data
public class AuthResponse {
    private String jwt;
    private String message;
    private UserDto user;

}
