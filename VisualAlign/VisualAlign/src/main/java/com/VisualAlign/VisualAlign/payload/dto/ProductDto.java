package com.VisualAlign.VisualAlign.payload.dto;

import java.time.LocalDateTime;

import com.VisualAlign.VisualAlign.modal.Category;
import com.VisualAlign.VisualAlign.modal.Store;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDto {

    private Long id;

    private String name;

    private String sku;

    private String description;
    private Double sellingPrice;
    private String image;

    private Double mrp;
    private String brand;

    private Long storeId;
    private Long categoryId;

    @ManyToOne
    private Category category;

    @ManyToOne
    private Store store;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
