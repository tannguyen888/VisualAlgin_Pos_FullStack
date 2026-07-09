package com.VisualAlign.VisualAlign.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.VisualAlign.VisualAlign.mapper.ProductMapper;
import com.VisualAlign.VisualAlign.modal.Category;
import com.VisualAlign.VisualAlign.modal.Product;
import com.VisualAlign.VisualAlign.modal.Store;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.ProductDto;
import com.VisualAlign.VisualAlign.repository.CategoryRepository;
import com.VisualAlign.VisualAlign.repository.ProductRepository;
import com.VisualAlign.VisualAlign.repository.StoreRepository;
import com.VisualAlign.VisualAlign.service.ProductService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductServiceimplement implements ProductService {
    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductDto createProduct(ProductDto productDto, User user) {
        Store store = resolveStore(productDto, user != null ? user.getStore() : null);
        Category category = resolveCategory(productDto, null);
        Product product = ProductMapper.toEntity(productDto, store, category);
        return ProductMapper.toDto(productRepository.save(product));
    }

    @Override
    public ProductDto getProductById(Long id) throws RuntimeException {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        return ProductMapper.toDto(product);
    }

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream().map(ProductMapper::toDto).toList();
    }

    public ProductDto updateProduct(Long id, ProductDto productDto) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        if (productDto.getStoreId() != null) {
            Category category = categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(
                            () -> new RuntimeException("Category not found with id: " + productDto.getCategoryId()));
            existingProduct.setCategory(category);
        }

        existingProduct.setName(productDto.getName());
        existingProduct.setSku(productDto.getSku());
        existingProduct.setDescription(productDto.getDescription());
        existingProduct.setSellingPrice(productDto.getSellingPrice());
        existingProduct.setImage(productDto.getImage());
        existingProduct.setMrp(productDto.getMrp());
        existingProduct.setBrand(productDto.getBrand());
        existingProduct.setStore(resolveStore(productDto, existingProduct.getStore()));
        existingProduct.setCategory(resolveCategory(productDto, existingProduct.getCategory()));

        return ProductMapper.toDto(productRepository.save(existingProduct));
    }

    @Override
    public void deleteProduct(Long id, User user) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        productRepository.delete(product);
    }

    @Override
    public List<ProductDto> getProductsByStoreId(Long storeId) {
        return productRepository.findByStoreId(storeId).stream().map(ProductMapper::toDto).toList();
    }

    @Override
    public ProductDto updateProduct(Long id, ProductDto productDto, User user) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));

        existingProduct.setName(productDto.getName());
        existingProduct.setSku(productDto.getSku());
        existingProduct.setDescription(productDto.getDescription());
        existingProduct.setSellingPrice(productDto.getSellingPrice());
        existingProduct.setImage(productDto.getImage());
        existingProduct.setMrp(productDto.getMrp());
        existingProduct.setBrand(productDto.getBrand());
        existingProduct.setStore(resolveStore(productDto, user != null ? user.getStore() : existingProduct.getStore()));
        existingProduct.setCategory(resolveCategory(productDto, existingProduct.getCategory()));

        return ProductMapper.toDto(productRepository.save(existingProduct));
    }

    @Override
    public List<ProductDto> searchByKeyword(Long storeId, String keyword) {
        List<Product> products = productRepository.searchByKeyword(storeId, keyword);
        return products.stream().map(ProductMapper::toDto).collect(Collectors.toList());

    }

    @Override
    public List<ProductDto> getByStoreId(Long storeId, User user) {
        return productRepository.findByStoreId(storeId).stream().map(ProductMapper::toDto).toList();
    }

    private Store resolveStore(ProductDto productDto, Store fallbackStore) {
        if (productDto.getStore() != null) {
            return productDto.getStore();
        }
        if (productDto.getStoreId() != null) {
            return storeRepository.findById(productDto.getStoreId())
                    .orElseThrow(() -> new RuntimeException("Store not found with id: " + productDto.getStoreId()));
        }
        if (fallbackStore != null) {
            return fallbackStore;
        }
        throw new RuntimeException("Store is required for product operations");
    }

    private Category resolveCategory(ProductDto productDto, Category fallbackCategory) {
        if (productDto.getCategory() != null) {
            return productDto.getCategory();
        }
        if (productDto.getCategoryId() != null) {
            return categoryRepository.findById(productDto.getCategoryId())
                    .orElseThrow(
                            () -> new RuntimeException("Category not found with id: " + productDto.getCategoryId()));
        }
        return fallbackCategory;
    }

}
