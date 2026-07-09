package com.VisualAlign.VisualAlign.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.VisualAlign.VisualAlign.domain.OrderStatus;
import com.VisualAlign.VisualAlign.domain.PaymentType;
import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.payload.dto.OrderDto;
import com.VisualAlign.VisualAlign.payload.request.ApiResponse;
import com.VisualAlign.VisualAlign.service.OrderService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<OrderDto> createOrder(@RequestBody OrderDto orderDto) throws Exception {
        OrderDto createdOrder = orderService.createOrder(orderDto);
        return ResponseEntity.ok(createdOrder);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) throws Exception {
        OrderDto orderDto = orderService.getOrderById(id);
        return ResponseEntity.ok(orderDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteOrder(@PathVariable Long id) throws Exception {
        ApiResponse response = orderService.deleteOrder(id);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDto> updateOrder(@PathVariable Long id,
            @RequestBody OrderDto order)
            throws Exception {
        OrderDto updatedOrder = orderService.updateOrder(id, order);
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/cashier/{id}")
    public ResponseEntity<List<OrderDto>> getOrdersByCashierId(@PathVariable Long id)
            throws Exception, UserException {
        List<OrderDto> orders = orderService.getOrdersByCashierId(id);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/customer/{id}")
    public ResponseEntity<List<OrderDto>> getOrdersByCustomerId(@PathVariable Long id) throws Exception {
        List<OrderDto> orders = orderService.getOrdersByCustomerId(id);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/branch/{id}")
    public ResponseEntity<List<OrderDto>> getOrdersByBranchId(@PathVariable Long id)
            throws Exception {
        List<OrderDto> orders = orderService.getTodayOrdersByBranchId(id);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/Top5/branch/{id}")
    public ResponseEntity<List<OrderDto>> getTop5OrdersByBranchId(@PathVariable Long id)
            throws Exception {
        List<OrderDto> orders = orderService.getTop5RecentOrdersByBranchId(id);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/branch/{branchId}/filter")
    public ResponseEntity<List<OrderDto>> getOrdersByBranch(@PathVariable Long branchId,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long cashierId,
            @RequestParam(required = false) PaymentType paymentType)
            throws Exception {
        List<OrderDto> orders = orderService.getOrderByBranch(branchId, customerId, cashierId, paymentType, null);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/recent/{branchId}")
    public ResponseEntity<List<OrderDto>> getRecentOrdersByBranch(@PathVariable Long branchId,
            @RequestParam(required = false) Long customerId,
            @RequestParam(required = false) Long cashierId,
            @RequestParam(required = false) PaymentType paymentType,
            @RequestParam(required = false) OrderStatus orderStatus)
            throws Exception {
        List<OrderDto> orders = orderService.getRecentOrder(branchId, customerId, cashierId, paymentType, orderStatus);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/pickup/{customerId}")
    public ResponseEntity<List<OrderDto>> getPickUpOrdersByCustomerId(@PathVariable Long customerId) throws Exception {
        List<OrderDto> orders = orderService.getPickUpOrderByCustomerId(customerId);
        return ResponseEntity.ok(orders);
    }
}
