package com.VisualAlign.VisualAlign.payload.dto;

import java.time.LocalDateTime;

import com.VisualAlign.VisualAlign.domain.PaymentType;
import com.VisualAlign.VisualAlign.modal.Branch;
import com.VisualAlign.VisualAlign.modal.ShiftReport;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.ManyToOne;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RefundDto {
    private Long id;

    private OrderDto order;
    private Long orderId;

    private String reason;

    private Double amount;

    private ShiftReport shiftReport;
    private Long shiftReportId;
    private String cashierName;
    private UserDto cashier;

    private BranchDto branch;
    private Long branchId;

    private LocalDateTime createdAt;

    private PaymentType paymentType;
}
