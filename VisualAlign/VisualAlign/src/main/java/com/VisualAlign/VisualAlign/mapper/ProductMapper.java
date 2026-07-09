package com.VisualAlign.VisualAlign.mapper;

import com.VisualAlign.VisualAlign.modal.Category;
import com.VisualAlign.VisualAlign.modal.Product;
import com.VisualAlign.VisualAlign.modal.Store;
import com.VisualAlign.VisualAlign.payload.dto.ProductDto;

public class ProductMapper {
    public static ProductDto toDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .sku(product.getSku())
                .description(product.getDescription())
                .sellingPrice(product.getSellingPrice())
                .image(product.getImage())
                .mrp(product.getMrp())
                .brand(product.getBrand())
                .storeId(product.getStore() != null ? product.getStore().getId() : null)
                .categoryId(product.getCategory() != null ? product.getCategory().getId() : null)
                .category(product.getCategory())
                .store(product.getStore())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public static Product toEntity(ProductDto productDto,
            Store store,
            Category category) {
        return Product.builder()
                .id(productDto.getId())
                .name(productDto.getName())
                .sku(productDto.getSku())
                .description(productDto.getDescription())
                .sellingPrice(productDto.getSellingPrice())
                .image(productDto.getImage())
                .mrp(productDto.getMrp())
                .brand(productDto.getBrand())
                .store(store)
                .category(category)
                .createdAt(productDto.getCreatedAt())
                .updatedAt(productDto.getUpdatedAt())
                .build();
    }

}
