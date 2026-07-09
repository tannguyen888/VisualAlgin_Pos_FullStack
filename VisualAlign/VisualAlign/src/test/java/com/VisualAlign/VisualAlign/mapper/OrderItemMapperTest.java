package com.VisualAlign.VisualAlign.mapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import org.junit.jupiter.api.Test;

import com.VisualAlign.VisualAlign.modal.Order;
import com.VisualAlign.VisualAlign.modal.OrderItem;
import com.VisualAlign.VisualAlign.modal.Product;
import com.VisualAlign.VisualAlign.payload.dto.OrderItemDto;

class OrderItemMapperTest {

    @Test
    void toDto_shouldMapBasicFieldsAndRelations() {
        Product product = new Product();
        product.setId(11L);

        Order order = new Order();
        order.setId(22L);

        OrderItem orderItem = OrderItem.builder()
                .id(3L)
                .quantiy(5)
                .price(125000.0)
                .product(product)
                .order(order)
                .build();

        OrderItemDto dto = OrderItemMapper.toDto(orderItem);

        assertNotNull(dto);
        assertEquals(3L, dto.getId());
        assertEquals(5, dto.getQuantiy());
        assertEquals(125000.0, dto.getPrice());
        assertEquals(11L, dto.getProductId());
        assertEquals(22L, dto.getOrderId());
    }

    @Test
    void toEntity_shouldMapBasicFields() {
        OrderItemDto dto = OrderItemDto.builder()
                .id(8L)
                .quantiy(2)
                .price(99000.0)
                .build();

        OrderItem entity = OrderItemMapper.toEntity(dto);

        assertNotNull(entity);
        assertEquals(8L, entity.getId());
        assertEquals(2, entity.getQuantiy());
        assertEquals(99000.0, entity.getPrice());
        assertNull(entity.getProduct());
        assertNull(entity.getOrder());
    }

    @Test
    void mapper_shouldHandleNullInputs() {
        assertNull(OrderItemMapper.toDto(null));
        assertNull(OrderItemMapper.toEntity(null));
    }
}
