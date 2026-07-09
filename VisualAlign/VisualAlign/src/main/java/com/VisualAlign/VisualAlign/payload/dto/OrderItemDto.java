package com.VisualAlign.VisualAlign.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {
    private Long id;

    private Integer quantiy;

    private Double price;

    private ProductDto product;

    private Long productId;

    private Long orderId;
}
