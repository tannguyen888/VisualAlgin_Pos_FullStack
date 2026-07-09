package com.VisualAlign.VisualAlign.mapper;

import com.VisualAlign.VisualAlign.modal.Branch;
import com.VisualAlign.VisualAlign.modal.Inventory;
import com.VisualAlign.VisualAlign.modal.Product;
import com.VisualAlign.VisualAlign.payload.dto.InventoryDto;

public class InventoryMapper {
    public static InventoryDto toDto(Inventory inventory) {
        return InventoryDto.builder()
                .id(inventory.getId())
                .product(ProductMapper.toDto(inventory.getProduct()))
                .branch(BranchMapper.toDto(inventory.getBranch()))
                .quantity(inventory.getQuantity())
                .lastUpdate(inventory.getLastUpdate())
                .build();
    }

    public static Inventory toEntity(InventoryDto inventoryDto, Branch existing, Product product) {
        Inventory inventory = new Inventory();
        inventory.setId(inventoryDto.getId());
        inventory.setBranch(existing);
        inventory.setProduct(product);
        inventory.setQuantity(inventoryDto.getQuantity());
        inventory.setLastUpdate(inventoryDto.getLastUpdate());
        return inventory;
    }
}
