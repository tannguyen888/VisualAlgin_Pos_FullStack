package com.VisualAlign.VisualAlign.service;

import com.VisualAlign.VisualAlign.payload.dto.UserDto;
import com.VisualAlign.VisualAlign.payload.response.AuthResponse;

public interface AuthService {

    AuthResponse register(UserDto userDto);

    AuthResponse login(UserDto userDto);
}