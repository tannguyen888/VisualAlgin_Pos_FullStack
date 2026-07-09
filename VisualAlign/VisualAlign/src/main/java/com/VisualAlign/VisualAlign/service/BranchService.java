package com.VisualAlign.VisualAlign.service;

import java.util.List;

import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.BranchDto;

public interface BranchService {
    BranchDto createBranch(BranchDto branchDto, User user);

    BranchDto updateBranch(Long branchId, BranchDto branchDto, User user);

    void deleteBranch(Long branchId);

    List<BranchDto> getAllBranchesByStoreId(Long storeId);

    BranchDto getBranchById(Long branchId);

}
