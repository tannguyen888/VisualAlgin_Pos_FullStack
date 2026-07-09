package com.VisualAlign.VisualAlign.mapper;

import java.util.List;

import com.VisualAlign.VisualAlign.modal.Order;
import com.VisualAlign.VisualAlign.modal.Product;
import com.VisualAlign.VisualAlign.modal.Refund;
import com.VisualAlign.VisualAlign.modal.ShiftReport;
import com.VisualAlign.VisualAlign.payload.dto.shiftReportDto;

public class ShiftReportMapper {
    public static shiftReportDto toDto(ShiftReport shiftReport) {
        if (shiftReport == null) {
            return null;
        }

        return shiftReportDto.builder()
                .id(shiftReport.getId())
                .cashier(UserMapper.toDto(shiftReport.getCashier()))
                .cashierId(shiftReport.getCashier() != null ? shiftReport.getCashier().getId() : null)
                .branch(BranchMapper.toDto(shiftReport.getBranch()))
                .branchId(shiftReport.getBranch() != null ? shiftReport.getBranch().getId() : null)
                .shiftStart(shiftReport.getShiftStart())
                .shiftEnd(shiftReport.getShiftEnd())
                .totalSales(shiftReport.getTotalSales())
                .totalRefunds(shiftReport.getTotalRefunds())
                .totalOrders(shiftReport.getTotalOrders())
                .recentOrders(mapOrders(shiftReport.getRecentOrders()))
                .netSale(shiftReport.getNetSale())
                .topSellingProducts(mapProducts(shiftReport.getTopSellingProducts()))
                .refunds(mapRefunds(shiftReport.getRefunds()))
                .paymentSummaries(shiftReport.getPaymentSummaries())
                .build();
    }

    private static List<Refund> mapRefunds(List<Refund> refunds) {
        if (refunds == null) {
            return List.of();
        }
        return refunds;
    }

    private static List<Product> mapProducts(List<Product> products) {
        if (products == null) {
            return List.of();
        }
        return products;
    }

    private static List<Order> mapOrders(List<Order> orders) {
        if (orders == null) {
            return List.of();
        }
        return orders;
    }

    public static ShiftReport toEntity(shiftReportDto shiftReportDto) {
        if (shiftReportDto == null) {
            return null;
        }

        ShiftReport shiftReport = new ShiftReport();
        shiftReport.setId(shiftReportDto.getId());
        shiftReport.setCashier(UserMapper.toEntity(shiftReportDto.getCashier()));
        shiftReport.setBranch(BranchMapper.toEntity(shiftReportDto.getBranch(), null));
        shiftReport.setShiftStart(shiftReportDto.getShiftStart());
        shiftReport.setShiftEnd(shiftReportDto.getShiftEnd());
        shiftReport.setTotalSales(shiftReportDto.getTotalSales());
        shiftReport.setTotalRefunds(shiftReportDto.getTotalRefunds());
        shiftReport.setNetSale(shiftReportDto.getNetSale());
        shiftReport.setTotalOrders(shiftReportDto.getTotalOrders());
        shiftReport.setRecentOrders(mapOrders(shiftReportDto.getRecentOrders()));
        shiftReport.setTopSellingProducts(mapProducts(shiftReportDto.getTopSellingProducts()));
        shiftReport.setRefunds(mapRefunds(shiftReportDto.getRefunds()));
        shiftReport.setPaymentSummaries(shiftReportDto.getPaymentSummaries());

        return shiftReport;
    }

}
