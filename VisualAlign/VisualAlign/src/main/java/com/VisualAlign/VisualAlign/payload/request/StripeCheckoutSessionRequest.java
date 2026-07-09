package com.VisualAlign.VisualAlign.payload.request;

import java.util.List;

import lombok.Data;

@Data
public class StripeCheckoutSessionRequest {
    private List<StripeCheckoutItemRequest> items;
    private Double totalAmount;
    private String customerEmail;
    private String successUrl;
    private String cancelUrl;
}
