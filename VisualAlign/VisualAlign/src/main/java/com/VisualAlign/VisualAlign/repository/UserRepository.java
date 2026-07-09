package com.VisualAlign.VisualAlign.repository;

import com.VisualAlign.VisualAlign.modal.Store;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.UserDto;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    String findRoleByEmail(String email);

    List<User> findByStore(Store store);

    List<User> findByBranchId(Long branchId);

    String findFullNameByEmail(String email);

    void save(UserDto user1);
}