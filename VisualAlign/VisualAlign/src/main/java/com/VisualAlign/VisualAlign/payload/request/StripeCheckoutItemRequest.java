package com.VisualAlign.VisualAlign.payload.request;

import lombok.Data;

@Data
public class StripeCheckoutItemRequest {
    private Long id;
    private Long productId;
    private String name;
    private String sku;
    private Double price;
    private Integer quantity;
}
