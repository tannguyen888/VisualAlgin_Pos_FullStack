package com.VisualAlign.VisualAlign.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.VisualAlign.VisualAlign.modal.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Product findByName(String name);

    List<Product> findByStoreId(Long storeId);

    @Query("SELECT p FROM Product p WHERE p.store.id = :storeId AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Product> searchByKeyword(@Param("storeId") Long storeId, @Param("query") String keyword);

    Product findBySku(String sku);

}
