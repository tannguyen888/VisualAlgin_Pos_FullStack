package com.VisualAlign.VisualAlign.payload.dto;

import java.beans.Transient;
import java.time.LocalDateTime;
import java.util.List;

import com.VisualAlign.VisualAlign.modal.Branch;
import com.VisualAlign.VisualAlign.modal.Order;
import com.VisualAlign.VisualAlign.modal.PaymentSummary;
import com.VisualAlign.VisualAlign.modal.Product;
import com.VisualAlign.VisualAlign.modal.Refund;
import com.VisualAlign.VisualAlign.modal.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class shiftReportDto {
    private Long id;

    private LocalDateTime shiftStart;
    private LocalDateTime shiftEnd;

    private Double totalSales;
    private Double totalRefunds;
    private Double netSale;
    private Double totalOrders;

    private UserDto cashier;
    private Long cashierId;
    private Long branchId;
    private BranchDto branch;

    private List<PaymentSummary> paymentSummaries;

    private List<Product> topSellingProducts;

    private List<Order> recentOrders;

    private List<Refund> refunds;
}
