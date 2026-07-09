package com.VisualAlign.VisualAlign.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.VisualAlign.VisualAlign.mapper.InventoryMapper;
import com.VisualAlign.VisualAlign.modal.Branch;
import com.VisualAlign.VisualAlign.modal.Inventory;
import com.VisualAlign.VisualAlign.modal.Product;
import com.VisualAlign.VisualAlign.payload.dto.InventoryDto;
import com.VisualAlign.VisualAlign.repository.BranchRepository;
import com.VisualAlign.VisualAlign.repository.InventoryRepository;
import com.VisualAlign.VisualAlign.repository.ProductRepository;
import com.VisualAlign.VisualAlign.service.InventoryService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryServiceimplement implements InventoryService {
    private final InventoryRepository inventoryRepository;
    private final BranchRepository branchRepository;
    private final ProductRepository productRepository;

    @Override
    public InventoryDto createInventory(InventoryDto inventoryDto) {
        if (inventoryDto.getBranch() == null || inventoryDto.getBranch().getId() == null) {
            throw new RuntimeException("Branch id is required");
        }
        if (inventoryDto.getProduct() == null || inventoryDto.getProduct().getId() == null) {
            throw new RuntimeException("Product id is required");
        }

        Long branchId = inventoryDto.getBranch().getId();
        Long productId = inventoryDto.getProduct().getId();

        Branch branch = branchRepository.findById(branchId)
                .orElseThrow(() -> new RuntimeException("Branch not found with id: " + branchId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        Inventory inventory = InventoryMapper.toEntity(inventoryDto, branch, product);
        return InventoryMapper.toDto(inventoryRepository.save(inventory));
    }

    @Override
    public InventoryDto updateInventory(Long id, InventoryDto inventoryDto) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));

        inventory.setQuantity(inventoryDto.getQuantity());

        return InventoryMapper.toDto(inventoryRepository.save(inventory));

    }

    @Override
    public void deleteInventory(Long id) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));
        inventoryRepository.delete(inventory);
    }

    @Override
    public InventoryDto getInventoryByProductIdAndBranchId(Long productId, Long branchId) {
        Inventory inventory = inventoryRepository.findByProductIdAndBranchId(productId, branchId);
        if (inventory == null) {
            throw new RuntimeException(
                    "Inventory not found for product id: " + productId + " and branch id: " + branchId);
        }
        return InventoryMapper.toDto(inventory);
    }

    @Override
    public List<InventoryDto> getAllInventoryByBranchId(Long branchId) {
        List<Inventory> inventories = inventoryRepository.findByBranchId(branchId);
        return inventories.stream().map(InventoryMapper::toDto).collect(Collectors.toList());

    }

    @Override
    public InventoryDto getInventoryById(Long id) {
        Inventory inventory = inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found with id: " + id));
        return InventoryMapper.toDto(inventory);

    }
}
