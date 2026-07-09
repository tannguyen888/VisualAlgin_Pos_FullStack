package com.VisualAlign.VisualAlign.modal;

import java.util.List;

import com.VisualAlign.VisualAlign.domain.PaymentType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentSummary {
    private PaymentType paymentType;
    private Double totalAmount;

    private int transactionCount;
    private Double percentage;

}
