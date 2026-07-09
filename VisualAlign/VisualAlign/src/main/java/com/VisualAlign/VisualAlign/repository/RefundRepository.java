package com.VisualAlign.VisualAlign.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.VisualAlign.VisualAlign.modal.Branch;
import com.VisualAlign.VisualAlign.modal.Refund;
import com.VisualAlign.VisualAlign.modal.ShiftReport;
import com.VisualAlign.VisualAlign.modal.User;

public interface RefundRepository extends JpaRepository<Refund, Long> {
    List<Refund> findByCashierAndCreatedAtBetween(User cashier, LocalDateTime startDate, LocalDateTime endDate);

    List<Refund> findByCashierId(Long cashierId);

    List<Refund> findByShiftReportId(Long shiftReportId);

    List<Refund> findByBranchId(Long branchId);
}
