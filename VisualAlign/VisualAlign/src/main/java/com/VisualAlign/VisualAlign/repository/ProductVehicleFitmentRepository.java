package com.VisualAlign.VisualAlign.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.VisualAlign.VisualAlign.modal.ProductVehicleFitment;

// TODO: JpaRepository cho ProductVehicleFitment.
// TODO: Them query lay fitments theo productId.
// TODO: Them query loc products theo vehicle filter (make/model/year).
public interface ProductVehicleFitmentRepository extends JpaRepository<ProductVehicleFitment, Long> {
    List<ProductVehicleFitment> findByProductId(Long productId);

    List<ProductVehicleFitment> findByVehicleIdIn(Collection<Long> vehicleIds);

    void deleteByProductId(Long productId);

}
