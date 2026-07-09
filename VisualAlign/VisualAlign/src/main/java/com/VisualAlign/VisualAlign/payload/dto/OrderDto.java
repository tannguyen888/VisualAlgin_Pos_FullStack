package com.VisualAlign.VisualAlign.payload.dto;

import java.security.Timestamp;
import java.time.LocalDateTime;
import java.util.List;

import com.VisualAlign.VisualAlign.domain.OrderType;
import com.VisualAlign.VisualAlign.domain.PaymentType;
import com.VisualAlign.VisualAlign.modal.Customer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderDto {
    private Long id;

    private Double totalAmount;

    private LocalDateTime createdAt;

    private Long branchId;
    private Long customerId;
    private BranchDto branch;
    private OrderType orderType;
    private LocalDateTime orderTime;
    private String pickupNote;

    private UserDto cashier;
    private PaymentType paymentType;
    private Customer customer;

    private List<OrderItemDto> orderItems;

}
