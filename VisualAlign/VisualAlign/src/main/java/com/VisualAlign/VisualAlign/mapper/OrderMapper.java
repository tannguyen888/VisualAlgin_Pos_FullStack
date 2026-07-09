package com.VisualAlign.VisualAlign.mapper;

import java.util.List;

import com.VisualAlign.VisualAlign.modal.Branch;
import com.VisualAlign.VisualAlign.modal.Customer;
import com.VisualAlign.VisualAlign.modal.Order;
import com.VisualAlign.VisualAlign.payload.dto.OrderDto;

public class OrderMapper {
    public static OrderDto toDto(Order order) {
        if (order == null) {
            return null;
        }

        return OrderDto.builder()
                .id(order.getId())
                .customer(order.getCustomer())
                .customerId(order.getCustomer() != null ? order.getCustomer().getId() : null)
                .totalAmount(order.getTotalAmount())
                .branch(BranchMapper.toDto(order.getBranch()))
                .branchId(order.getBranch() != null ? order.getBranch().getId() : null)
                .cashier(UserMapper.toDto(order.getCashier()))
                .paymentType(order.getPaymentType())
                .orderItems(order.getOrderItems() == null ? List.of()
                        : order.getOrderItems().stream()
                                .map(OrderItemMapper::toDto)
                                .toList())
                .createdAt(order.getCreatedAt())
                .build();
    }

    public static Order toEntity(OrderDto orderDto) {
        if (orderDto == null) {
            return null;
        }

        Branch branch = orderDto.getBranch() != null
                ? BranchMapper.toEntity(orderDto.getBranch(), null)
                : null;
        if (branch == null && orderDto.getBranchId() != null) {
            branch = new Branch();
            branch.setId(orderDto.getBranchId());
        }

        Customer customer = orderDto.getCustomer();
        if (customer == null && orderDto.getCustomerId() != null) {
            customer = new Customer();
            customer.setId(orderDto.getCustomerId());
        }

        return Order.builder()
                .id(orderDto.getId())
                .customer(customer)
                .totalAmount(orderDto.getTotalAmount())
                .cashier(UserMapper.toEntity(orderDto.getCashier()))
                .branch(branch)
                .paymentType(orderDto.getPaymentType())
                .createdAt(orderDto.getCreatedAt())
                .build();
    }
}
