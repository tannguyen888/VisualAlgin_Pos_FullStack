package com.VisualAlign.VisualAlign.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.VisualAlign.VisualAlign.payload.dto.shiftReportDto;
import com.VisualAlign.VisualAlign.service.ShiftReport;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/shift-reports")
@RequiredArgsConstructor
public class ShiftReportController {

    private final ShiftReport shiftReportService;

    @PostMapping("/start")
    public ResponseEntity<shiftReportDto> startShift(
            @RequestParam Long cashierId,
            @RequestParam(required = false) Long branchId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime shiftStart)
            throws Exception {
        return ResponseEntity.ok(shiftReportService.startShift(cashierId, branchId, shiftStart));
    }

    @PutMapping("/{shiftReportId}/end")
    public ResponseEntity<shiftReportDto> endShift(
            @PathVariable Long shiftReportId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime shiftEnd)
            throws Exception {
        return ResponseEntity.ok(shiftReportService.endShift(shiftReportId, shiftEnd));
    }

    @GetMapping("/{id}")
    public ResponseEntity<shiftReportDto> getShiftReportById(@PathVariable Long id) throws Exception {
        return ResponseEntity.ok(shiftReportService.getShiftReportById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<shiftReportDto>> getAllShiftReports() {
        return ResponseEntity.ok(shiftReportService.getAllShiftReports());
    }

    @GetMapping("/cashier/{cashierId}")
    public ResponseEntity<List<shiftReportDto>> getShiftReportsByCashierId(@PathVariable Long cashierId)
            throws Exception {
        return ResponseEntity.ok(shiftReportService.getShiftReportsByCashierId(cashierId));
    }

    @GetMapping("/branch/{branchId}")
    public ResponseEntity<List<shiftReportDto>> getShiftReportsByBranchID(@PathVariable Long branchId)
            throws Exception {
        return ResponseEntity.ok(shiftReportService.getShiftReportsByBranchID(branchId));
    }

    @GetMapping("/cashier/{cashierId}/current")
    public ResponseEntity<shiftReportDto> getCurrentShiftProgress(@PathVariable Long cashierId) throws Exception {
        return ResponseEntity.ok(shiftReportService.getCurrentShiftProgress(cashierId));
    }

    @GetMapping("/cashier/{cashierId}/date")
    public ResponseEntity<shiftReportDto> getShiftByCashierAndDate(
            @PathVariable Long cashierId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date)
            throws Exception {
        return ResponseEntity.ok(shiftReportService.getShiftByCashierAndDate(cashierId, date));
    }

    @GetMapping("/cashier/{cashierId}/active")
    public ResponseEntity<shiftReportDto> getShiftByCashierAndShiftEndIsNullOrderByShiftStartDesc(
            @PathVariable Long cashierId)
            throws Exception {
        return ResponseEntity.ok(shiftReportService.getShiftByCashierAndShiftEndIsNullOrderByShiftStartDesc(cashierId));
    }
}
