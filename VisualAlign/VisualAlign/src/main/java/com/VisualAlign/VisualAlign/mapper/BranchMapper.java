package com.VisualAlign.VisualAlign.mapper;

import com.VisualAlign.VisualAlign.modal.Branch;
import com.VisualAlign.VisualAlign.modal.Store;
import com.VisualAlign.VisualAlign.payload.dto.BranchDto;

public class BranchMapper {

    public static BranchDto toDto(Branch branch) {
        return BranchDto.builder()
                .id(branch.getId())
                .name(branch.getName())
                .address(branch.getAddress())
                .phone(branch.getPhone())
                .email(branch.getEmail())
                .workingDays(branch.getWorkingDays())
                .openTime(branch.getOpenTime())
                .closeTime(branch.getCloseTime())
                .createAt(branch.getCreateAt())
                .updateAt(branch.getUpdateAt())
                .storeId(branch.getStore() != null ? branch.getStore().getId() : null)
                .manager(UserMapper.toDto(branch.getManager()))
                .build();
    }

    public static Branch toEntity(BranchDto branchDto, Store store) {
        Branch branch = new Branch();
        branch.setId(branchDto.getId());
        branch.setName(branchDto.getName());
        branch.setAddress(branchDto.getAddress());
        branch.setStore(store);
        branch.setPhone(branchDto.getPhone());
        branch.setEmail(branchDto.getEmail());
        branch.setWorkingDays(branchDto.getWorkingDays());
        branch.setOpenTime(branchDto.getOpenTime());
        branch.setCloseTime(branchDto.getCloseTime());
        return branch;
    }
}
