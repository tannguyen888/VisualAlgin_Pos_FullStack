package com.VisualAlign.VisualAlign.mapper;

import com.VisualAlign.VisualAlign.modal.Category;
import com.VisualAlign.VisualAlign.payload.dto.CategoryDto;

public class CategoryMapper {
    public static CategoryDto toDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getFullName())
                .storeId(category.getStore() != null ? category.getStore().getId() : null)
                .build();
    }

    public static Category toEntity(CategoryDto categoryDto) {
        Category category = new Category();
        category.setId(categoryDto.getId());
        category.setFullName(categoryDto.getName());
        return category;
    }
}
