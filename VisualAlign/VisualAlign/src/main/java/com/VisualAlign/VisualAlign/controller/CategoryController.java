package com.VisualAlign.VisualAlign.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.payload.dto.CategoryDto;
import com.VisualAlign.VisualAlign.payload.request.ApiResponse;
import com.VisualAlign.VisualAlign.service.CategoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping("/create")
    public ResponseEntity<CategoryDto> createCategory(@RequestBody CategoryDto categoryDto,
            @RequestHeader("Authorization") String jwt) throws Exception, UserException {
        CategoryDto createdCategory = categoryService.createCategory(categoryDto);
        return ResponseEntity.ok(createdCategory);
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<CategoryDto>> getCategoriesByStoreId(@PathVariable Long storeId) throws UserException {
        List<CategoryDto> categories = categoryService.getCategoriesByStore(storeId);
        return ResponseEntity.ok(categories);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDto> updateCategory(@PathVariable Long id,
            @RequestBody CategoryDto categoryDto, @RequestHeader("Authorization") String jwt)
            throws Exception, UserException {
        CategoryDto updatedCategory = categoryService.updateCategory(id, categoryDto);
        return ResponseEntity.ok(updatedCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteCategory(@PathVariable Long id)
            throws Exception,
            UserException {
        categoryService.deleteCategory(id);
        ApiResponse response = new ApiResponse();
        response.setMessage("Category deleted successfully");
        return ResponseEntity.ok(response);
    }

}
