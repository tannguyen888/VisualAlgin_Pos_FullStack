package com.VisualAlign.VisualAlign.modal;

import java.time.LocalDateTime;
import java.util.List;

import com.VisualAlign.VisualAlign.payload.dto.UserDto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ShiftReport {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private LocalDateTime shiftStart;
    private LocalDateTime shiftEnd;

    private Double totalSales;
    private Double totalRefunds;
    private Double netSale;
    private Double totalOrders;

    @ManyToOne
    private User cashier;

    @ManyToOne
    private Branch branch;
    // transient means that this field will not be persisted in the database,
    // it will only be used for calculations and will not be stored in the database
    @Transient
    private List<PaymentSummary> paymentSummaries;
    // cascade all means that when we delete a shift report, all the payment
    // summaries associated with it will also be deleted
    @OneToMany(cascade = jakarta.persistence.CascadeType.ALL)
    private List<Product> topSellingProducts;

    @OneToMany(cascade = jakarta.persistence.CascadeType.ALL)
    private List<Order> recentOrders;

    // mappedBy will not create another table in the database, it will use the
    // existing table and add a column to it
    @OneToMany(mappedBy = "shiftReport", cascade = jakarta.persistence.CascadeType.ALL)
    private List<Refund> refunds;
}
