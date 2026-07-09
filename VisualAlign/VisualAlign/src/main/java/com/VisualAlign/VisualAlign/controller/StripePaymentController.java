package com.VisualAlign.VisualAlign.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.VisualAlign.VisualAlign.payload.request.StripeCheckoutItemRequest;
import com.VisualAlign.VisualAlign.payload.request.StripeCheckoutSessionRequest;
import com.VisualAlign.VisualAlign.payload.response.StripeCheckoutSessionResponse;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

@RestController
@RequestMapping("/api/payments/stripe")
public class StripePaymentController {

    private static final String DEFAULT_CURRENCY = "vnd";

    @Value("${stripe.secret-key:}")
    private String stripeSecretKey;

    @PostMapping("/checkout-session")
    public ResponseEntity<StripeCheckoutSessionResponse> createCheckoutSession(
            @RequestBody StripeCheckoutSessionRequest request) throws StripeException {

        if (!StringUtils.hasText(stripeSecretKey)) {
            throw new IllegalStateException(
                    "Stripe secret key is missing. Configure stripe.secret-key in backend env.");
        }

        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new IllegalArgumentException("Checkout items are required.");
        }

        if (!StringUtils.hasText(request.getSuccessUrl()) || !StringUtils.hasText(request.getCancelUrl())) {
            throw new IllegalArgumentException("successUrl and cancelUrl are required.");
        }

        Stripe.apiKey = stripeSecretKey;

        SessionCreateParams.Builder builder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(request.getSuccessUrl())
                .setCancelUrl(request.getCancelUrl());

        if (StringUtils.hasText(request.getCustomerEmail())) {
            builder.setCustomerEmail(request.getCustomerEmail());
        }

        List<StripeCheckoutItemRequest> items = request.getItems();
        for (StripeCheckoutItemRequest item : items) {
            int quantity = item.getQuantity() == null ? 0 : item.getQuantity();
            double price = item.getPrice() == null ? 0 : item.getPrice();

            if (quantity <= 0 || price <= 0) {
                continue;
            }

            long unitAmount = BigDecimal.valueOf(price)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(0, RoundingMode.HALF_UP)
                    .longValue();

            String productName = StringUtils.hasText(item.getName())
                    ? item.getName()
                    : "Product #" + (item.getProductId() != null ? item.getProductId() : item.getId());

            SessionCreateParams.LineItem.PriceData.ProductData.Builder productBuilder = SessionCreateParams.LineItem.PriceData.ProductData
                    .builder().setName(productName);

            if (StringUtils.hasText(item.getSku())) {
                productBuilder.setDescription("SKU: " + item.getSku());
            }

            builder.addLineItem(
                    SessionCreateParams.LineItem.builder()
                            .setQuantity((long) quantity)
                            .setPriceData(
                                    SessionCreateParams.LineItem.PriceData.builder()
                                            .setCurrency(DEFAULT_CURRENCY)
                                            .setUnitAmount(unitAmount)
                                            .setProductData(productBuilder.build())
                                            .build())
                            .build());
        }

        Session session = Session.create(builder.build());
        return ResponseEntity.ok(new StripeCheckoutSessionResponse(session.getId(), session.getUrl()));
    }
}
