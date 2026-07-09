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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.ProductDto;
import com.VisualAlign.VisualAlign.service.ProductService;
import com.VisualAlign.VisualAlign.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;
    private final UserService userService;

    @PostMapping("/create")
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto productDto,
            @RequestHeader("Authorization") String jwt) throws Exception, UserException {
        User user = userService.getUserFromJwttoken(jwt);
        ProductDto createdProduct = productService.createProduct(productDto, user);
        return ResponseEntity.ok(createdProduct);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) throws Exception {
        ProductDto product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<ProductDto>> getProductsByStoreId(@PathVariable Long storeId) {
        List<ProductDto> products = productService.getProductsByStoreId(storeId);

        return ResponseEntity.ok(products);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable Long id,
            @RequestBody ProductDto productDto,
            @RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.getUserFromJwttoken(jwt);
        ProductDto updatedProduct = productService.updateProduct(id, productDto, user);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id,
            @RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.getUserFromJwttoken(jwt);
        productService.deleteProduct(id, user);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/store/{storeId}/search")
    public ResponseEntity<List<ProductDto>> getByStoreId(@PathVariable Long storeId, @RequestParam String keyword,
            @RequestHeader("Authorization") String jwt) throws UserException {
        return ResponseEntity.ok(productService.searchByKeyword(storeId, keyword));
    }
}
