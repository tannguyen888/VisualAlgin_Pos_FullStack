package com.VisualAlign.VisualAlign.modal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// TODO: Entity map quan he nhieu-nhieu giua Product va Vehicle.
// TODO: Muc dich: xac dinh san pham nao tuong thich xe nao.
// TODO: Goi y field: id, product, vehicle, fitType, note, source, confidence.
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "product_vehicle", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "product_id", "vehicle_id" })
})
public class ProductVehicleFitment {
    // TODO: Khai bao fields + JPA relations.
    // TODO: Tao unique constraint product_id + vehicle_id de tranh duplicate
    // mapping.

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long productId;

    private Long vehicleId;

    private String fitType;

    private String note;
    private String source;
    private String confidence;

}
