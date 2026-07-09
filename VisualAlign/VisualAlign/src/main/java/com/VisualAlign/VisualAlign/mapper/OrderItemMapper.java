package com.VisualAlign.VisualAlign.mapper;

import com.VisualAlign.VisualAlign.modal.OrderItem;
import com.VisualAlign.VisualAlign.payload.dto.OrderItemDto;

public class OrderItemMapper {
    public static OrderItemDto toDto(OrderItem orderItem) {

        if (orderItem == null) {
            return null;
        }
        return OrderItemDto.builder()
                .id(orderItem.getId())
                .quantiy(orderItem.getQuantiy())
                .price(orderItem.getPrice())
                .product(ProductMapper.toDto(orderItem.getProduct()))
                .productId(orderItem.getProduct() != null ? orderItem.getProduct().getId() : null)
                .orderId(orderItem.getOrder() != null ? orderItem.getOrder().getId() : null)
                .build();
    }

    public static OrderItem toEntity(OrderItemDto orderItemDto) {
        if (orderItemDto == null) {
            return null;
        }

        OrderItem orderItem = new OrderItem();
        orderItem.setId(orderItemDto.getId());
        orderItem.setQuantiy(orderItemDto.getQuantiy());
        orderItem.setPrice(orderItemDto.getPrice());
        // Note: Product and Order associations should be set in the service layer
        return orderItem;
    }
}
