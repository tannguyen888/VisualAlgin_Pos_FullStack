package com.VisualAlign.VisualAlign.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.VisualAlign.VisualAlign.domain.OrderType;
import com.VisualAlign.VisualAlign.modal.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerId(Long customerId);

    List<Order> findByBranchId(Long branchId);

    List<Order> findByCashierId(Long cashierId);

    List<Order> findByBranchIdAndCreatedAtBetween(Long branchId, LocalDateTime start, LocalDateTime end);

    List<Order> findByCashierIdAndCreatedAtBetween(Long cashierId, LocalDateTime from, LocalDateTime to);

    List<Order> findTop5ByBranchIdOrderByCreatedAtDesc(Long branchId);

    List<Order> findByBranchIdAndCreatedAtAfter(Long branchId, LocalDateTime oneHourAgo);

    List<Order> findByCustomerIdAndOrderType(Long customerId, OrderType orderType);

}
