package com.VisualAlign.VisualAlign.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.VisualAlign.VisualAlign.domain.UserRole;
import com.VisualAlign.VisualAlign.mapper.UserMapper;
import com.VisualAlign.VisualAlign.modal.Branch;
import com.VisualAlign.VisualAlign.modal.Store;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.UserDto;
import com.VisualAlign.VisualAlign.repository.BranchRepository;
import com.VisualAlign.VisualAlign.repository.StoreRepository;
import com.VisualAlign.VisualAlign.repository.UserRepository;
import com.VisualAlign.VisualAlign.service.EmployeeService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployeeServiceimplement implements EmployeeService {
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;

    @Override
    public UserDto createStoreEmployee(UserDto employee, Long storeId) throws Exception {
        if (employee == null) {
            throw new RuntimeException("Employee payload is required");
        }
        if (employee.getRole() == null) {
            throw new RuntimeException("Employee role is required");
        }

        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + storeId));

        Branch branch = null;
        if (employee.getRole() == UserRole.ROLE_BRANCH_MANAGER) {
            if (employee.getBranchId() != null) {
                branch = branchRepository.findById(employee.getBranchId())
                        .orElseThrow(() -> new RuntimeException("Branch not found with id: " + employee.getBranchId()));
            } else {
                throw new RuntimeException("Branch ID is required for branch managers");
            }
        }
        User user = UserMapper.toEntity(employee);
        user.setStore(store);
        user.setBranch(branch);
        user.setPassword(passwordEncoder.encode(employee.getPassword()));
        User savedEmployee = userRepository.save(user);
        if (employee.getRole() == UserRole.ROLE_BRANCH_MANAGER && branch != null) {
            branch.setManager(savedEmployee);
            branchRepository.save(branch);
        }

        return UserMapper.toDto(savedEmployee);

    }

    @Override
    public UserDto createBranchEmployee(UserDto employee, Long branchId) throws Exception {
        if (employee == null) {
            throw new RuntimeException("Employee payload is required");
        }
        if (employee.getRole() == null) {
            throw new RuntimeException("Employee role is required");
        }

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found with id: " + branchId));
        if (employee.getRole() == UserRole.ROLE_BRANCH_MANAGER) {
            throw new RuntimeException("Cannot assign branch manager role to branch employee");
        }

        User user = UserMapper.toEntity(employee);
        user.setBranch(branch);
        user.setStore(branch.getStore());
        user.setPassword(passwordEncoder.encode(employee.getPassword()));

        User savedEmployee = userRepository.save(user);
        return UserMapper.toDto(savedEmployee);
    }

    @Override
    public UserDto updateEmployee(Long employeeId, UserDto employeeDetails) throws Exception {
        if (employeeDetails == null) {
            throw new RuntimeException("Employee details are required");
        }

        User existingEmployee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));

        if (employeeDetails.getBranchId() != null) {
            Branch branch = branchRepository.findById(employeeDetails.getBranchId())
                    .orElseThrow(() -> new RuntimeException(
                            "Branch not found with id: " + employeeDetails.getBranchId()));
            existingEmployee.setBranch(branch);
            existingEmployee.setStore(branch.getStore());
        } else if (employeeDetails.getStoreId() != null) {
            Store store = storeRepository.findById(employeeDetails.getStoreId())
                    .orElseThrow(() -> new RuntimeException(
                            "Store not found with id: " + employeeDetails.getStoreId()));
            existingEmployee.setStore(store);
        }

        existingEmployee.setFullName(employeeDetails.getFullName());
        existingEmployee.setEmail(employeeDetails.getEmail());
        existingEmployee.setPhone(employeeDetails.getPhone());
        existingEmployee.setRole(employeeDetails.getRole());

        if (employeeDetails.getPassword() != null && !employeeDetails.getPassword().isBlank()) {
            existingEmployee.setPassword(passwordEncoder.encode(employeeDetails.getPassword()));
        }

        userRepository.save(existingEmployee);
        return UserMapper.toDto(existingEmployee);
    }

    @Override
    public void deleteEmployee(Long employeeId) throws Exception {
        User existingEmployee = userRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + employeeId));
        userRepository.delete(existingEmployee);
    }

    @Override
    public List<UserDto> findStoreEmployees(Long storeId, UserRole role) {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + storeId));

        return userRepository.findByStore(store).stream()
                .filter(user -> role == null || user.getRole() == role).map(UserMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserDto> findBranchEmployees(Long branchId, UserRole role) {
        branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found with id: " + branchId));

        List<UserDto> employees = userRepository.findByBranchId(branchId).stream()
                .filter(user -> role == null || user.getRole() == role).map(UserMapper::toDto)
                .collect(Collectors.toList());
        return employees;
    }
}
