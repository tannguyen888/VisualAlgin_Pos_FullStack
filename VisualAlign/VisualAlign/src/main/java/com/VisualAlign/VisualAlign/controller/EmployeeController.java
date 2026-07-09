package com.VisualAlign.VisualAlign.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.VisualAlign.VisualAlign.domain.UserRole;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.UserDto;
import com.VisualAlign.VisualAlign.service.EmployeeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;

    @PostMapping("/store/{storeId}")
    public ResponseEntity<UserDto> createStoreEmployee(@PathVariable Long storeId,
            @RequestBody UserDto userDto) throws Exception {
        UserDto createdEmployee = employeeService.createStoreEmployee(userDto, storeId);
        return ResponseEntity.ok(createdEmployee);
    }

    @PostMapping("/branch/{branchId}")
    public ResponseEntity<UserDto> createBranchEmployee(@PathVariable Long branchId,
            @RequestBody UserDto userDto) throws Exception {
        UserDto createdEmployee = employeeService.createBranchEmployee(userDto, branchId);
        return ResponseEntity.ok(createdEmployee);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<UserDto>> getStoreEmployees(@PathVariable Long storeId,
            @RequestParam(required = false) UserRole userRole) {
        List<UserDto> employees = employeeService.findStoreEmployees(storeId, userRole);
        return ResponseEntity.ok(employees);
    }

    @PutMapping("/{employeeId}")
    public ResponseEntity<UserDto> updateEmployee(@PathVariable Long employeeId, @RequestBody UserDto userDto)
            throws Exception {
        UserDto updatedEmployee = employeeService.updateEmployee(employeeId, userDto);
        return ResponseEntity.ok(updatedEmployee);
    }

    @DeleteMapping("/{employeeId}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long employeeId) throws Exception {
        employeeService.deleteEmployee(employeeId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<UserDto>> getBranchEmployees(@PathVariable Long branchId,
            @RequestParam(required = false) UserRole userRole) throws Exception {
        List<UserDto> employees = employeeService.findBranchEmployees(branchId, userRole);
        return ResponseEntity.ok(employees);
    }
}