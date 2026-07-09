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
import org.springframework.web.bind.annotation.RestController;

import com.VisualAlign.VisualAlign.payload.dto.InventoryDto;
import com.VisualAlign.VisualAlign.service.InventoryService;

import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/inventories")
@RequiredArgsConstructor
public class InventoryController {
    private final InventoryService inventoryService;

    @PostMapping("/create")
    public ResponseEntity<InventoryDto> createInventory(@RequestBody InventoryDto inventoryDto) {
        InventoryDto createdInventory = inventoryService.createInventory(inventoryDto);
        return ResponseEntity.ok(createdInventory);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<InventoryDto> updateInventory(@PathVariable Long id, @RequestBody InventoryDto inventoryDto) {
        InventoryDto updatedInventory = inventoryService.updateInventory(id, inventoryDto);
        return ResponseEntity.ok(updatedInventory);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InventoryDto> getInventoryById(@PathVariable Long id) {
        InventoryDto inventory = inventoryService.getInventoryById(id);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/product/{productId}/branch/{branchId}")
    public ResponseEntity<InventoryDto> getInventoryByProductIdAndBranchId(@PathVariable Long productId,
            @PathVariable Long branchId) {
        InventoryDto inventory = inventoryService.getInventoryByProductIdAndBranchId(productId, branchId);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<InventoryDto>> getInventoryByBranch(
            @PathVariable Long branchId) {

        return ResponseEntity.ok(inventoryService.getAllInventoryByBranchId(branchId));
    }
}
