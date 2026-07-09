package com.VisualAlign.VisualAlign.mapper;

import com.VisualAlign.VisualAlign.modal.Refund;
import com.VisualAlign.VisualAlign.payload.dto.RefundDto;

public class RefundMapper {
    public static RefundDto toDto(Refund refund) {
        return RefundDto.builder()
                .id(refund.getId())
                .orderId(refund.getOrder().getId())
                .shiftReportId(refund.getShiftReport().getId())
                .cashierName(refund.getCashier().getFullName())
                .branchId(refund.getBranch().getId())
                .amount(refund.getAmount())
                .reason(refund.getReason())
                .createdAt(refund.getCreatedAt())
                .paymentType(refund.getPaymentType())
                .build();
    }

    public static Refund toEntity(RefundDto refundDto) {
        Refund refund = new Refund();
        refund.setId(refundDto.getId());
        refund.setAmount(refundDto.getAmount());
        refund.setReason(refundDto.getReason());
        refund.setCreatedAt(refundDto.getCreatedAt());
        refund.setPaymentType(refundDto.getPaymentType());
        return refund;
    }
}
