package com.VisualAlign.VisualAlign.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.VisualAlign.VisualAlign.modal.ShiftReport;
import com.VisualAlign.VisualAlign.modal.User;

public interface ShiftReportRepository extends JpaRepository<ShiftReport, Long> {
    List<ShiftReport> findByCashierId(Long cashierId);

    List<ShiftReport> findByBranchId(Long branchId);

    @Query("SELECT sr FROM ShiftReport sr WHERE sr.cashier.id = :cashierId AND sr.shiftEnd IS NULL ORDER BY sr.shiftStart DESC")
    Optional<ShiftReport> findTopByCashierAndShiftEndIsNullOrderByShiftStartDesc(@Param("cashierId") Long cashierId);

    @Query("SELECT sr FROM ShiftReport sr WHERE sr.cashier = :cashier AND sr.shiftStart BETWEEN :start AND :end")
    Optional<ShiftReport> findByCashierAndShiftStartBetween(Long cashierId, LocalDateTime start, LocalDateTime end);
}
