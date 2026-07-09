package com.VisualAlign.VisualAlign.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.mapper.ShiftReportMapper;
import com.VisualAlign.VisualAlign.modal.Branch;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.shiftReportDto;
import com.VisualAlign.VisualAlign.repository.BranchRepository;
import com.VisualAlign.VisualAlign.repository.ShiftReportRepository;
import com.VisualAlign.VisualAlign.service.ShiftReport;
import com.VisualAlign.VisualAlign.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShiftReportServiceimplement implements ShiftReport {

    private final ShiftReportRepository shiftReportRepository;
    private final BranchRepository branchRepository;
    private final UserService userService;

    @Override
    public shiftReportDto startShift(Long cashierId, Long branchId, LocalDateTime shiftStart)
            throws Exception {
        User user;
        try {
            user = userService.getCurrentUser();
        } catch (UserException exception) {
            throw new Exception(exception.getMessage(), exception);
        }

        if (user == null || !user.getId().equals(cashierId)) {
            throw new Exception("Unauthorized: User does not match the cashier ID");
        }

        if (shiftStart == null) {
            shiftStart = LocalDateTime.now();
        }

        LocalDateTime startOfDay = shiftStart.withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = shiftStart.withHour(23).withMinute(59).withSecond(59);

        Optional<com.VisualAlign.VisualAlign.modal.ShiftReport> existingShift = shiftReportRepository
                .findByCashierId(cashierId).stream()
                .filter(shift -> shift.getShiftStart() != null
                        && !shift.getShiftStart().isBefore(startOfDay)
                        && !shift.getShiftStart().isAfter(endOfDay)
                        && shift.getShiftEnd() == null)
                .findFirst();

        if (existingShift.isPresent()) {
            return ShiftReportMapper.toDto(existingShift.get());
        }

        Branch branch = user.getBranch();
        if (branchId != null) {
            branch = branchRepository.findById(branchId)
                    .orElseThrow(() -> new Exception("Branch not found with id: " + branchId));
        }
        if (branch == null) {
            throw new Exception("Branch is required to start shift");
        }

        com.VisualAlign.VisualAlign.modal.ShiftReport newShiftReport = com.VisualAlign.VisualAlign.modal.ShiftReport
                .builder()
                .cashier(user)
                .branch(branch)
                .shiftStart(shiftStart)
                .build();

        com.VisualAlign.VisualAlign.modal.ShiftReport savedShift = shiftReportRepository.save(newShiftReport);
        return ShiftReportMapper.toDto(savedShift);
    }

    @Override
    public shiftReportDto endShift(Long shiftReportId, LocalDateTime shiftEnd) throws Exception {
        com.VisualAlign.VisualAlign.modal.ShiftReport shiftReport = shiftReportRepository.findById(shiftReportId)
                .orElseThrow(() -> new Exception("Shift report not found with id: " + shiftReportId));
        if (shiftReport.getShiftEnd() != null) {
            throw new Exception("Shift has already been ended");
        }

        if (shiftEnd == null) {
            shiftEnd = LocalDateTime.now();
        }

        shiftReport.setShiftEnd(shiftEnd);
        return ShiftReportMapper.toDto(shiftReportRepository.save(shiftReport));

    }

    @Override
    public shiftReportDto getShiftReportById(Long id) throws Exception {
        com.VisualAlign.VisualAlign.modal.ShiftReport shiftReport = shiftReportRepository.findById(id)
                .orElseThrow(() -> new Exception("Shift report not found with id: " + id));
        return ShiftReportMapper.toDto(shiftReport);
    }

    @Override
    public java.util.List<shiftReportDto> getAllShiftReports() {
        List<com.VisualAlign.VisualAlign.modal.ShiftReport> shiftReports = shiftReportRepository.findAll();
        return shiftReports.stream()
                .map(ShiftReportMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public java.util.List<shiftReportDto> getShiftReportsByCashierId(Long cashierId) throws Exception {
        List<com.VisualAlign.VisualAlign.modal.ShiftReport> shiftReports = shiftReportRepository
                .findByCashierId(cashierId);
        return shiftReports.stream()
                .map(ShiftReportMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public java.util.List<shiftReportDto> getShiftReportsByBranchID(Long branchId) throws Exception {
        List<com.VisualAlign.VisualAlign.modal.ShiftReport> shiftReports = shiftReportRepository
                .findByBranchId(branchId);
        return shiftReports.stream()
                .map(ShiftReportMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public shiftReportDto getCurrentShiftProgress(Long cashierId) throws Exception {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = now.withHour(23).withMinute(59).withSecond(59);

        Optional<com.VisualAlign.VisualAlign.modal.ShiftReport> currentShift = shiftReportRepository
                .findByCashierId(cashierId).stream()
                .filter(shift -> shift.getShiftStart() != null
                        && !shift.getShiftStart().isBefore(startOfDay)
                        && !shift.getShiftStart().isAfter(endOfDay)
                        && (shift.getShiftEnd() == null || shift.getShiftEnd().isAfter(now)))
                .findFirst();

        if (currentShift.isEmpty()) {
            throw new Exception("No active shift found for cashier id: " + cashierId);
        }

        return ShiftReportMapper.toDto(currentShift.get());
    }

    @Override
    public shiftReportDto getShiftByCashierAndDate(Long cashierId, LocalDateTime date) throws Exception {
        LocalDateTime startOfDay = date.withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = date.withHour(23).withMinute(59).withSecond(59);

        Optional<com.VisualAlign.VisualAlign.modal.ShiftReport> shiftReport = shiftReportRepository
                .findByCashierId(cashierId).stream()
                .filter(shift -> shift.getShiftStart() != null
                        && !shift.getShiftStart().isBefore(startOfDay)
                        && !shift.getShiftStart().isAfter(endOfDay))
                .findFirst();

        if (shiftReport.isEmpty()) {
            throw new Exception(
                    "No shift report found for cashier id: " + cashierId + " on date: " + date.toLocalDate());
        }

        return ShiftReportMapper.toDto(shiftReport.get());
    }

    @Override
    public shiftReportDto getShiftByCashierAndShiftEndIsNullOrderByShiftStartDesc(Long cashierId) throws Exception {
        Optional<com.VisualAlign.VisualAlign.modal.ShiftReport> shiftReport = shiftReportRepository
                .findTopByCashierAndShiftEndIsNullOrderByShiftStartDesc(cashierId);

        if (shiftReport.isEmpty()) {
            throw new Exception("No active shift found for cashier id: " + cashierId);
        }

        return ShiftReportMapper.toDto(shiftReport.get());
    }
}
