package com.VisualAlign.VisualAlign.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.mapper.BranchMapper;
import com.VisualAlign.VisualAlign.modal.Branch;
import com.VisualAlign.VisualAlign.modal.Store;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.BranchDto;
import com.VisualAlign.VisualAlign.repository.BranchRepository;
import com.VisualAlign.VisualAlign.repository.StoreRepository;
import com.VisualAlign.VisualAlign.service.BranchService;
import com.VisualAlign.VisualAlign.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BranchServiceimplement implements BranchService {

    private final BranchRepository branchRepository;
    private final StoreRepository storeRepository;
    private final UserService userService;

    @Override
    public BranchDto createBranch(BranchDto branchDto, User user) {
        User currentUser = user != null ? user : getCurrentUserSafe();
        Store store = resolveStore(branchDto, currentUser);

        Branch branch = BranchMapper.toEntity(branchDto, store);
        branch.setStore(store);

        Branch savedBranch = branchRepository.save(branch);
        return BranchMapper.toDto(savedBranch);
    }

    @Override
    public BranchDto updateBranch(Long branchId, BranchDto branchDto, User user) {
        Branch existingBranch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found with id: " + branchId));

        if (branchDto.getStoreId() != null) {
            Store store = storeRepository.findById(branchDto.getStoreId())
                    .orElseThrow(() -> new RuntimeException("Store not found with id: " + branchDto.getStoreId()));
            existingBranch.setStore(store);
        }

        existingBranch.setName(branchDto.getName());
        existingBranch.setAddress(branchDto.getAddress());
        existingBranch.setPhone(branchDto.getPhone());
        existingBranch.setEmail(branchDto.getEmail());
        existingBranch.setWorkingDays(branchDto.getWorkingDays());
        existingBranch.setOpenTime(branchDto.getOpenTime());
        existingBranch.setCloseTime(branchDto.getCloseTime());

        return BranchMapper.toDto(branchRepository.save(existingBranch));
    }

    @Override
    public void deleteBranch(Long branchId) {
        Branch existingBranch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found with id: " + branchId));

        branchRepository.delete(existingBranch);
    }

    @Override
    public List<BranchDto> getAllBranchesByStoreId(Long storeId) {
        List<Branch> branches = branchRepository.findByStoreId(storeId);
        return branches.stream()
                .map(BranchMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BranchDto getBranchById(Long branchId) {
        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found with id: " + branchId));
        return BranchMapper.toDto(branch);
    }

    private User getCurrentUserSafe() {
        try {
            return userService.getCurrentUser();
        } catch (UserException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
    }

    private Store resolveStore(BranchDto branchDto, User currentUser) {
        if (branchDto.getStoreId() != null) {
            return storeRepository.findById(branchDto.getStoreId())
                    .orElseThrow(() -> new RuntimeException("Store not found with id: " + branchDto.getStoreId()));
        }

        if (currentUser != null && currentUser.getStore() != null) {
            return currentUser.getStore();
        }

        if (currentUser != null) {
            Store byAdmin = storeRepository.findByStoreAdmin(currentUser);
            if (byAdmin != null) {
                return byAdmin;
            }
        }

        throw new RuntimeException("Store not found for current user");
    }
}
