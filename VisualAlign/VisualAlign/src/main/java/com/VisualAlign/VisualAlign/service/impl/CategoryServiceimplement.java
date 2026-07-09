package com.VisualAlign.VisualAlign.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.VisualAlign.VisualAlign.domain.UserRole;
import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.mapper.CategoryMapper;
import com.VisualAlign.VisualAlign.modal.Category;
import com.VisualAlign.VisualAlign.modal.Store;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.CategoryDto;
import com.VisualAlign.VisualAlign.repository.CategoryRepository;
import com.VisualAlign.VisualAlign.repository.StoreRepository;
import com.VisualAlign.VisualAlign.service.CategoryService;
import com.VisualAlign.VisualAlign.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryServiceimplement implements CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserService userService;
    private final StoreRepository storeRepository;

    @Override
    public CategoryDto createCategory(CategoryDto categoryDto) {

        User user;
        try {
            user = userService.getCurrentUser();
        } catch (UserException e) {
            throw new RuntimeException(e.getMessage(), e);
        }
        Store store = user.getStore();
        if (store == null && categoryDto.getStoreId() != null) {
            store = storeRepository.findById(categoryDto.getStoreId())
                    .orElseThrow(() -> new RuntimeException("Store not found"));
        }
        if (store == null) {
            throw new RuntimeException("Store not found");
        }

        checkAuthority(user, store);

        Category createCategory = CategoryMapper.toEntity(categoryDto);
        createCategory.setStore(store);
        return CategoryMapper.toDto(categoryRepository.save(createCategory));

    }

    @Override
    public List<CategoryDto> getCategoriesByStore(Long storeId) {
        return categoryRepository.findByStoreId(storeId)
                .stream()
                .map(CategoryMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDto updateCategory(Long id, CategoryDto categoryDto) throws UserException {
        Category existingCategory = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));

        User user = userService.getCurrentUser();

        existingCategory.setFullName(categoryDto.getName());

        if (categoryDto.getStoreId() != null) {
            Store store = storeRepository.findById(categoryDto.getStoreId())
                    .orElseThrow(() -> new RuntimeException("Store not found with id: " + categoryDto.getStoreId()));
            existingCategory.setStore(store);
        }

        checkAuthority(user, existingCategory.getStore());
        return CategoryMapper.toDto(categoryRepository.save(existingCategory));
    }

    @Override
    public void deleteCategory(Long id) throws UserException {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        User user = userService.getCurrentUser();
        checkAuthority(user, category.getStore());
        categoryRepository.delete(category);
    }

    private void checkAuthority(User user, Store store) {
        boolean isAdmin = user.getRole().equals(UserRole.ROLE_ADMIN);
        boolean isManager = user.getRole().equals(UserRole.ROLE_STORE_MANAGER);
        boolean isSameStore = user.equals(store.getStoreAdmin());

        if ((isAdmin && isSameStore) && !isManager) {
            throw new RuntimeException("Unauthorized to perform this action");

        }

    }

}
