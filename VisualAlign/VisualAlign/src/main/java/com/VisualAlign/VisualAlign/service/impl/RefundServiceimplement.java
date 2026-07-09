package com.VisualAlign.VisualAlign.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import com.VisualAlign.VisualAlign.mapper.RefundMapper;
import com.VisualAlign.VisualAlign.modal.Branch;
import com.VisualAlign.VisualAlign.modal.Order;
import com.VisualAlign.VisualAlign.modal.Refund;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.payload.dto.RefundDto;
import com.VisualAlign.VisualAlign.payload.request.ApiResponse;
import com.VisualAlign.VisualAlign.repository.OrderRepository;
import com.VisualAlign.VisualAlign.repository.RefundRepository;
import com.VisualAlign.VisualAlign.service.RefundService;
import com.VisualAlign.VisualAlign.service.UserService;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefundServiceimplement implements RefundService {

    private final RefundRepository refundRepository;
    private final UserService userService;
    private final OrderRepository orderRepository;

    @Override
    public RefundDto createRefund(Refund refund) throws Exception {
        User cashier;
        try {
            cashier = userService.getCurrentUser();
        } catch (UserException exception) {
            throw new Exception(exception.getMessage(), exception);
        }

        Order order = orderRepository.findById(refund.getOrder().getId())
                .orElseThrow(() -> new Exception("Order not found with id: " + refund.getOrder().getId()));

        Branch branch = order.getBranch();
        Refund newRefund = Refund.builder()
                .order(order)
                .cashier(cashier)
                .branch(branch)
                .amount(refund.getAmount())
                .reason(refund.getReason())
                .paymentType(refund.getPaymentType())
                .build();
        Refund savedRefund = refundRepository.save(newRefund);
        return RefundMapper.toDto(savedRefund);
    }

    @Override
    public List<RefundDto> getAllRefunds() {
        List<Refund> refunds = refundRepository.findAll();
        return refunds.stream().map(RefundMapper::toDto).toList();
    }

    @Override
    public RefundDto getRefundByCashier(Long cashierId) throws Exception {
        List<Refund> refunds = refundRepository.findByCashierId(cashierId);
        if (refunds.isEmpty()) {
            throw new Exception("No refunds found for cashier with id: " + cashierId);
        }
        return refunds.stream().map(RefundMapper::toDto).findFirst().orElseThrow();
    }

    @Override
    public RefundDto getRefundByShiftReport(Long shiftReportId) throws Exception {
        List<Refund> refunds = refundRepository.findByShiftReportId(shiftReportId);
        if (refunds.isEmpty()) {
            throw new Exception("No refunds found for shift report with id: " + shiftReportId);
        }
        return refunds.stream().map(RefundMapper::toDto).findFirst().orElseThrow();
    }

    @Override
    public List<RefundDto> getRefundsByCashierAndDateRange(Long cashierId, LocalDateTime startDate,
            LocalDateTime endDate) throws Exception {
        User cashier;
        try {
            cashier = userService.getUserById(cashierId);
        } catch (UserException exception) {
            throw new Exception(exception.getMessage(), exception);
        }

        List<Refund> refunds = refundRepository.findByCashierAndCreatedAtBetween(cashier, startDate, endDate);
        if (refunds.isEmpty()) {
            throw new Exception("No refunds found for cashier with id: " + cashierId + " in the specified date range");
        }
        return refunds.stream().map(RefundMapper::toDto).toList();
    }

    @Override
    public List<RefundDto> getRefundByBranch(Long branchId) throws Exception {
        List<Refund> refunds = refundRepository.findByBranchId(branchId);
        if (refunds.isEmpty()) {
            throw new Exception("No refunds found for branch with id: " + branchId);
        }
        return refunds.stream().map(RefundMapper::toDto).toList();
    }

    @Override
    public Refund getRefundById(Long id) throws Exception {
        return refundRepository.findById(id)
                .orElseThrow(() -> new Exception("Refund not found with id: " + id));
    }

    @Override
    public ApiResponse deleteRefundById(Long id) throws Exception {
        Refund refund = refundRepository.findById(id)
                .orElseThrow(() -> new Exception("Refund not found with id: " + id));
        refundRepository.delete(refund);
        ApiResponse response = new ApiResponse();
        response.setMessage("Refund deleted successfully");
        return response;
    }

}
