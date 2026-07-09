package com.VisualAlign.VisualAlign.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.BranchDto;
import com.VisualAlign.VisualAlign.service.BranchService;
import com.VisualAlign.VisualAlign.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/branches")
@RequiredArgsConstructor
public class BranchController {

    private final BranchService branchService;
    private final UserService userService;

    @PostMapping("/create")
    public ResponseEntity<BranchDto> createBranch(@RequestBody BranchDto branchDto,
            @RequestHeader("Authorization") String jwt) throws UserException {
        User currentUser = userService.getUserFromJwttoken(jwt);
        BranchDto createdBranch = branchService.createBranch(branchDto, currentUser);
        return ResponseEntity.ok(createdBranch);
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<BranchDto> updateBranch(@PathVariable Long id,
            @RequestBody BranchDto branchDto,
            @RequestHeader("Authorization") String jwt) throws UserException {
        User currentUser = userService.getUserFromJwttoken(jwt);
        BranchDto updatedBranch = branchService.updateBranch(id, branchDto, currentUser);
        return ResponseEntity.ok(updatedBranch);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteBranch(@PathVariable Long id) {
        branchService.deleteBranch(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<BranchDto>> getBranchesByStoreId(@PathVariable Long storeId) {
        List<BranchDto> branches = branchService.getAllBranchesByStoreId(storeId);
        return ResponseEntity.ok(branches);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BranchDto> getBranchById(@PathVariable Long id) {
        BranchDto branch = branchService.getBranchById(id);
        return ResponseEntity.ok(branch);
    }

}
