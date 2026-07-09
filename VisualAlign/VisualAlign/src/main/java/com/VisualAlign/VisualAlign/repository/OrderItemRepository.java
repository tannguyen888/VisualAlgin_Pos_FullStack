package com.VisualAlign.VisualAlign.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.VisualAlign.VisualAlign.modal.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}
