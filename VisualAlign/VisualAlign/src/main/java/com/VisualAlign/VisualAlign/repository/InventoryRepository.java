package com.VisualAlign.VisualAlign.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.VisualAlign.VisualAlign.modal.Branch;
import com.VisualAlign.VisualAlign.modal.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Inventory findByProductId(Long productId, Long branchId);

    List<Inventory> findByBranchId(Long branchId);

    Inventory findByProductIdAndBranchId(Long productId, Long branchId);

}
