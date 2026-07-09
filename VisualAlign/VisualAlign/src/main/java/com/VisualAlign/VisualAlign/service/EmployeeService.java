package com.VisualAlign.VisualAlign.service;

import java.util.List;

import com.VisualAlign.VisualAlign.domain.UserRole;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.UserDto;

public interface EmployeeService {
    UserDto createStoreEmployee(UserDto employee, Long storeId) throws Exception;

    UserDto createBranchEmployee(UserDto employee, Long branchId) throws Exception;

    UserDto updateEmployee(Long employeeId, UserDto employeeDetails) throws Exception;

    void deleteEmployee(Long employeeId) throws Exception;

    List<UserDto> findStoreEmployees(Long storeId, UserRole role);

    List<UserDto> findBranchEmployees(Long branchId, UserRole role);

}
