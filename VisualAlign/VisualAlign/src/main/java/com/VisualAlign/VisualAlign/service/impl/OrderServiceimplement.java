package com.VisualAlign.VisualAlign.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import com.VisualAlign.VisualAlign.domain.OrderStatus;
import com.VisualAlign.VisualAlign.domain.OrderType;
import com.VisualAlign.VisualAlign.domain.PaymentType;
import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.mapper.OrderMapper;
import com.VisualAlign.VisualAlign.modal.Branch;
import com.VisualAlign.VisualAlign.modal.Customer;
import com.VisualAlign.VisualAlign.modal.Order;
import com.VisualAlign.VisualAlign.modal.OrderItem;
import com.VisualAlign.VisualAlign.modal.Product;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.OrderDto;
import com.VisualAlign.VisualAlign.payload.request.ApiResponse;
import com.VisualAlign.VisualAlign.repository.BranchRepository;
import com.VisualAlign.VisualAlign.repository.CustomerRepository;
import com.VisualAlign.VisualAlign.repository.OrderItemRepository;
import com.VisualAlign.VisualAlign.repository.OrderRepository;
import com.VisualAlign.VisualAlign.repository.ProductRepository;
import com.VisualAlign.VisualAlign.service.OrderEmailService;
import com.VisualAlign.VisualAlign.service.OrderService;
import com.VisualAlign.VisualAlign.service.UserService;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceimplement implements OrderService {
        private final BranchRepository branchRepository;
        private final CustomerRepository customerRepository;
        private final OrderRepository orderRepository;
        private final UserService userService;
        private final ProductRepository productRepository;
        private final OrderItemRepository orderItemRepository;
        private final OrderEmailService orderEmailService;

        @Override
        public OrderDto createOrder(OrderDto orderDto) throws Exception {

                User cashier;
                try {
                        cashier = userService.getCurrentUser();
                } catch (UserException exception) {
                        throw new Exception(exception.getMessage(), exception);
                }
                Branch branch = cashier.getBranch();

                if (branch == null) {
                        Long requestedBranchId = orderDto.getBranchId();
                        if (requestedBranchId == null && orderDto.getBranch() != null) {
                                requestedBranchId = orderDto.getBranch().getId();
                        }

                        if (requestedBranchId != null) {
                                final Long branchId = requestedBranchId;
                                branch = branchRepository.findById(branchId)
                                                .orElseThrow(() -> new Exception(
                                                                "Branch not found with id: " + branchId));
                        }
                }

                if (branch == null) {
                        throw new Exception("Cashier does not belong to any branch");
                }

                Customer customer = null;
                Long requestedCustomerId = orderDto.getCustomerId();
                if (requestedCustomerId == null && orderDto.getCustomer() != null) {
                        requestedCustomerId = orderDto.getCustomer().getId();
                }

                if (requestedCustomerId != null) {
                        final Long customerId = requestedCustomerId;
                        customer = customerRepository.findById(customerId)
                                        .orElseThrow(() -> new Exception("Customer not found with id: " + customerId));
                }

                Order order = Order.builder()
                                .totalAmount(orderDto.getTotalAmount())
                                .createdAt(orderDto.getCreatedAt())
                                .branch(branch)
                                .cashier(cashier)
                                .customer(customer)
                                .build();
                List<OrderItem> orderItems = (orderDto.getOrderItems() == null
                                ? List.<com.VisualAlign.VisualAlign.payload.dto.OrderItemDto>of()
                                : orderDto.getOrderItems()).stream()
                                .map(itemDto -> {
                                        Product product = productRepository.findById(itemDto.getProductId())
                                                        .orElseThrow(
                                                                        () -> new RuntimeException(
                                                                                        "Product not found with id: "
                                                                                                        + itemDto.getProductId()));
                                        OrderItem orderItem = OrderItem.builder()
                                                        .product(product)
                                                        .quantiy(itemDto.getQuantiy())
                                                        .price(itemDto.getPrice())
                                                        .build();
                                        orderItem.setOrder(order);
                                        return orderItem;
                                })
                                .toList();
                double totalAmount = orderItems.stream()
                                .mapToDouble(item -> item.getPrice() * item.getQuantiy())
                                .sum();
                order.setOrderItems(orderItems);
                order.setTotalAmount(totalAmount);
                Order savedOrder = orderRepository.save(order);
                OrderDto savedOrderDto = OrderMapper.toDto(savedOrder);
                String storeEmail = branch.getEmail();
                boolean isPickup = savedOrderDto.getOrderType() != null
                                && savedOrderDto.getOrderType() == OrderType.PICKUP;

                if (isPickup && storeEmail != null && !storeEmail.isBlank()) {
                        orderEmailService.sendPickUpOrderEmail(storeEmail, savedOrderDto);
                }

                return savedOrderDto;
        }

        @Override
        public List<OrderDto> getOrderByBranch(Long branchId, Long customerId, Long cashierId, PaymentType paymentType,
                        OrderStatus orderStatus) {
                List<Order> orders = orderRepository.findByBranchId(branchId);

                return orders.stream()
                                .filter(order -> customerId == null
                                                || (order.getCustomer() != null
                                                                && customerId.equals(order.getCustomer().getId())))
                                .filter(order -> cashierId == null
                                                || (order.getCashier() != null
                                                                && cashierId.equals(order.getCashier().getId())))
                                .filter(order -> paymentType == null || paymentType.equals(order.getPaymentType()))
                                .map(OrderMapper::toDto)
                                .collect(Collectors.toList());
        }

        @Override
        public OrderDto getOrderById(Long id) throws Exception {
                return orderRepository.findById(id)
                                .map(OrderMapper::toDto)
                                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        }

        @Override
        public OrderDto updateOrder(Long id, OrderDto orderDto) {
                Order existingOrder = orderRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

                existingOrder.setPaymentType(orderDto.getPaymentType());
                existingOrder.setTotalAmount(orderDto.getTotalAmount());
                // Update other fields as needed

                return OrderMapper.toDto(orderRepository.save(existingOrder));
        }

        @Override
        public List<OrderDto> getRecentOrder(Long branchId, Long customerId, Long cashierId, PaymentType paymentType,
                        OrderStatus orderStatus) throws Exception {
                LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
                List<Order> orders = orderRepository.findByBranchIdAndCreatedAtAfter(branchId, oneHourAgo);
                Branch branch = branchRepository.findById(branchId)
                                .orElseThrow(() -> new Exception("Branch not found with id: " + branchId));

                return orders.stream()
                                .filter(order -> customerId == null
                                                || (order.getCustomer() != null
                                                                && customerId.equals(order.getCustomer().getId())))
                                .filter(order -> cashierId == null
                                                || (order.getCashier() != null
                                                                && cashierId.equals(order.getCashier().getId())))
                                .filter(order -> paymentType == null || paymentType.equals(order.getPaymentType()))
                                .map(OrderMapper::toDto)
                                .collect(Collectors.toList());
        }

        @Override
        public ApiResponse deleteOrder(Long id) throws Exception {
                Order existingOrder = orderRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
                orderRepository.delete(existingOrder);

                ApiResponse response = new ApiResponse();
                response.setMessage("Order deleted successfully");

                return response;
        }

        @Override
        public List<OrderDto> getOrdersByCashierId(Long cashierId) throws Exception, UserException {
                User cashier = userService.getUserById(cashierId);

                List<Order> orders = orderRepository.findByCashierId(cashierId);

                return orders.stream()
                                .map(OrderMapper::toDto)
                                .collect(Collectors.toList());

        }

        @Override
        public List<OrderDto> getTodayOrdersByBranchId(Long branchId) {
                LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
                LocalDateTime endOfDay = LocalDate.now().atTime(LocalTime.MAX);
                List<Order> orders = orderRepository.findByBranchIdAndCreatedAtBetween(branchId, startOfDay, endOfDay);
                return orders.stream()
                                .map(OrderMapper::toDto)
                                .collect(Collectors.toList());
        }

        @Override
        public List<OrderDto> getOrdersByCustomerId(Long customerId) {
                List<Order> orders = orderRepository.findByCustomerId(customerId);
                return orders.stream()
                                .map(OrderMapper::toDto)
                                .collect(Collectors.toList());
        }

        @Override
        public List<OrderDto> getTop5RecentOrdersByBranchId(Long branchId) {
                List<Order> orders = orderRepository.findTop5ByBranchIdOrderByCreatedAtDesc(branchId);
                return orders.stream()
                                .map(OrderMapper::toDto)
                                .collect(Collectors.toList());
        }

        @Override
        public List<OrderDto> getPickUpOrderByCustomerId(Long customerId) throws Exception {
                Customer customer = customerRepository.findById(customerId)
                                .orElseThrow(() -> new Exception("Customer not found with id: " + customerId));

                List<Order> orders = orderRepository.findByCustomerIdAndOrderType(customerId, OrderType.PICKUP);

                return orders.stream()
                                .map(OrderMapper::toDto)
                                .collect(Collectors.toList());
        }

}
