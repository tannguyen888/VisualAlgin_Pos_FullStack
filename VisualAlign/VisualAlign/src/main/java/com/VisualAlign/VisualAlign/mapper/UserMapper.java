package com.VisualAlign.VisualAlign.mapper;

import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.UserDto;

public class UserMapper {
    public static UserDto toDto(User user) {
        if (user == null) {
            return null;
        }

        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setEmail(user.getEmail());
        userDto.setFullName(user.getFullName());
        userDto.setRole(user.getRole());
        userDto.setPhone(user.getPhone());
        userDto.setStoreId(user.getStore() != null ? user.getStore().getId() : null);
        userDto.setBranchId(user.getBranch() != null ? user.getBranch().getId() : null);
        userDto.setCreatedAt(user.getCreatedAt());
        userDto.setLastLogin(user.getLastLogin());

        return userDto;
    }

    public static User toEntity(UserDto userDto) {
        if (userDto == null) {
            return null;
        }

        User user = new User();
        user.setId(userDto.getId());
        user.setEmail(userDto.getEmail());
        user.setFullName(userDto.getFullName());
        user.setRole(userDto.getRole());
        user.setPhone(userDto.getPhone());
        user.setCreatedAt(userDto.getCreatedAt());
        user.setUpdatedAt(userDto.getUpdatedAt());
        user.setLastLogin(userDto.getLastLogin());

        return user;
    }
}
