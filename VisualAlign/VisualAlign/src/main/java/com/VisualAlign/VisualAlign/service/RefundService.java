package com.VisualAlign.VisualAlign.service;

import java.time.LocalDateTime;
import java.util.List;

import com.VisualAlign.VisualAlign.modal.Refund;
import com.VisualAlign.VisualAlign.payload.dto.RefundDto;
import com.VisualAlign.VisualAlign.payload.request.ApiResponse;

public interface RefundService {

    RefundDto createRefund(Refund refund) throws Exception;

    List<RefundDto> getAllRefunds();

    RefundDto getRefundByCashier(Long cashierId) throws Exception;

    RefundDto getRefundByShiftReport(Long shiftReportId) throws Exception;

    List<RefundDto> getRefundsByCashierAndDateRange(Long cashierId, LocalDateTime startDate, LocalDateTime endDate)
            throws Exception;

    List<RefundDto> getRefundByBranch(Long branchId) throws Exception;

    Refund getRefundById(Long id) throws Exception;

    ApiResponse deleteRefundById(Long id) throws Exception;

}
