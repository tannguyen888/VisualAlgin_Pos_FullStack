package com.VisualAlign.VisualAlign.service;

import java.util.List;

import com.VisualAlign.VisualAlign.domain.OrderStatus;
import com.VisualAlign.VisualAlign.domain.PaymentType;
import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.payload.dto.OrderDto;
import com.VisualAlign.VisualAlign.payload.request.ApiResponse;

public interface OrderService {
        OrderDto createOrder(OrderDto orderDto) throws Exception;

        List<OrderDto> getOrderByBranch(Long branchId, Long customerId, Long cashierId, PaymentType paymentType,
                        OrderStatus orderStatus) throws Exception;

        OrderDto updateOrder(Long id, OrderDto orderDto) throws Exception;

        ApiResponse deleteOrder(Long id) throws Exception;

        List<OrderDto> getOrdersByCashierId(Long cashierId) throws Exception, UserException;

        List<OrderDto> getTodayOrdersByBranchId(Long branchId) throws Exception;

        List<OrderDto> getOrdersByCustomerId(Long customerId) throws Exception;

        List<OrderDto> getTop5RecentOrdersByBranchId(Long branchId) throws Exception;

        OrderDto getOrderById(Long id) throws Exception;

        List<OrderDto> getRecentOrder(Long branchId, Long customerId, Long cashierId, PaymentType paymentType,
                        OrderStatus orderStatus)
                        throws Exception;

        List<OrderDto> getPickUpOrderByCustomerId(Long customerId) throws Exception;

}
