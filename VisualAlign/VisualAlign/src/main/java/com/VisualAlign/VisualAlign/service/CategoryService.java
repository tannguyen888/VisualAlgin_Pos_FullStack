package com.VisualAlign.VisualAlign.service;

import java.util.List;

import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.modal.Category;
import com.VisualAlign.VisualAlign.payload.dto.CategoryDto;

public interface CategoryService {
    CategoryDto createCategory(CategoryDto categoryDto) throws UserException;

    List<CategoryDto> getCategoriesByStore(Long storeId) throws UserException;

    CategoryDto updateCategory(Long id, CategoryDto categoryDto) throws UserException;

    void deleteCategory(Long id) throws UserException;
}
