package com.VisualAlign.VisualAlign.service;

import java.time.LocalDateTime;
import java.util.List;

import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.shiftReportDto;

public interface ShiftReport {
        shiftReportDto startShift(Long cashierId,
                        Long branchId, LocalDateTime shiftStart) throws Exception;

        shiftReportDto endShift(Long shiftReportId,
                        LocalDateTime shiftEnd) throws Exception;

        shiftReportDto getShiftReportById(Long id) throws Exception;

        List<shiftReportDto> getAllShiftReports();

        List<shiftReportDto> getShiftReportsByCashierId(Long cashierId) throws Exception;

        List<shiftReportDto> getShiftReportsByBranchID(Long branchId) throws Exception;

        shiftReportDto getCurrentShiftProgress(Long cashierId) throws Exception;

        shiftReportDto getShiftByCashierAndDate(Long cashierId, LocalDateTime date) throws Exception;

        shiftReportDto getShiftByCashierAndShiftEndIsNullOrderByShiftStartDesc(Long cashierId) throws Exception;

}
