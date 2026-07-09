package com.VisualAlign.VisualAlign.service;

import com.VisualAlign.VisualAlign.payload.dto.OrderDto;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OrderEmailService {
    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Async
    public void sendOrderConfirmationEmail(OrderDto orderDto) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null || orderDto == null || orderDto.getCustomer() == null
                || orderDto.getCustomer().getEmail() == null || orderDto.getCustomer().getEmail().isBlank()) {
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(orderDto.getCustomer().getEmail());
        message.setSubject("Order Confirmation - Order #" + orderDto.getId());
        message.setText("Dear " + orderDto.getCustomer().getFirstName() + ",\n\n" +
                "Thank you for your order! Your order has been successfully placed.\n\n" +
                "Order Details:\n" +
                "Order ID: " + orderDto.getId() + "\n" +
                "Total Amount: $" + orderDto.getTotalAmount() + "\n" +
                "Order Type: " + orderDto.getOrderType() + "\n" +
                "Payment Type: " + orderDto.getPaymentType() + "\n\n" +
                "We will notify you once your order is ready for pickup or delivery.\n\n" +
                "Best regards,\n" +
                "VisualAlign Team");

        mailSender.send(message);
    }

    @Async
    public void sendPickUpOrderEmail(String storeEmail, OrderDto orderDto) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null || storeEmail == null || storeEmail.isBlank() || orderDto == null) {
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        LocalDateTime orderTime = orderDto.getOrderTime() != null ? orderDto.getOrderTime() : null;
        List<String> items = (orderDto.getOrderItems() == null
                ? List.<com.VisualAlign.VisualAlign.payload.dto.OrderItemDto>of()
                : orderDto.getOrderItems()).stream()
                .map(item -> item.getProduct().getName() + " (Quantity: " + item.getQuantiy() + ")")
                .toList();
        message.setTo(storeEmail);
        message.setSubject("New Pickup Order - Order #" + orderDto.getId());
        message.setText("Dear Store Team,\n\n" +
                "A new pickup order has been placed.\n\n" +
                "Order Time: " + (orderTime != null ? orderTime : "N/A") + "\n" +
                "Order Details:\n" +
                "Order ID: " + orderDto.getId() + "\n" +
                "Customer Name: " + (orderDto.getCustomer() != null ? orderDto.getCustomer().getFirstName() : "Walk-in")
                + "\n" +
                "Items:\n" +
                String.join("\n", items) + "\n" +
                "Total Amount: $" + orderDto.getTotalAmount() + "\n" +
                "Order Type: " + orderDto.getOrderType() + "\n" +
                "Payment Type: " + orderDto.getPaymentType() + "\n\n" +
                "Please prepare the order for pickup.\n\n" +
                "Best regards,\n" +
                "VisualAlign Team");

        mailSender.send(message);
    }
}
