package com.VisualAlign.VisualAlign.service;

import java.util.List;

import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.ProductDto;

public interface ProductService {
    ProductDto createProduct(ProductDto productDto, User user);

    ProductDto getProductById(Long id);

    List<ProductDto> getAllProducts();

    ProductDto updateProduct(Long id, ProductDto productDto, User user);

    void deleteProduct(Long id, User user);

    List<ProductDto> getByStoreId(Long storeId, User user);

    List<ProductDto> searchByKeyword(Long storeId, String keyword);

    List<ProductDto> getProductsByStoreId(Long storeId);

}
