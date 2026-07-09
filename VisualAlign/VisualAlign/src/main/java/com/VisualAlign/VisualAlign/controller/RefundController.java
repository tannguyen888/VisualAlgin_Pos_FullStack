package com.VisualAlign.VisualAlign.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.VisualAlign.VisualAlign.modal.Refund;
import com.VisualAlign.VisualAlign.payload.dto.RefundDto;
import com.VisualAlign.VisualAlign.payload.request.ApiResponse;
import com.VisualAlign.VisualAlign.service.RefundService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/refunds")
@RequiredArgsConstructor
public class RefundController {

    private final RefundService refundService;

    @PostMapping("/create")
    public ResponseEntity<RefundDto> createRefund(@RequestBody Refund refund) throws Exception {
        RefundDto createdRefund = refundService.createRefund(refund);
        return ResponseEntity.ok(createdRefund);
    }

    @GetMapping("/all")
    public ResponseEntity<List<RefundDto>> getAllRefunds() {
        return ResponseEntity.ok(refundService.getAllRefunds());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Refund> getRefundById(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(refundService.getRefundById(id));
    }

    @GetMapping("/cashier/{cashierId}")
    public ResponseEntity<RefundDto> getRefundByCashier(@PathVariable Long cashierId) throws Exception {
        return ResponseEntity.ok(refundService.getRefundByCashier(cashierId));
    }

    @GetMapping("/shift-report/{shiftReportId}")
    public ResponseEntity<RefundDto> getRefundByShiftReport(@PathVariable Long shiftReportId) throws Exception {
        return ResponseEntity.ok(refundService.getRefundByShiftReport(shiftReportId));
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<RefundDto>> getRefundByBranch(@PathVariable Long branchId) throws Exception {
        return ResponseEntity.ok(refundService.getRefundByBranch(branchId));
    }

    @GetMapping("/cashier/{cashierId}/range")
    public ResponseEntity<List<RefundDto>> getRefundsByCashierAndDateRange(
            @PathVariable Long cashierId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate)
            throws Exception {
        return ResponseEntity.ok(refundService.getRefundsByCashierAndDateRange(cashierId, startDate, endDate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteRefundById(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(refundService.deleteRefundById(id));
    }
}
