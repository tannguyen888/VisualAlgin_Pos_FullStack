package com.VisualAlign.VisualAlign.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.VisualAlign.VisualAlign.modal.Vehicle;

// TODO: JpaRepository cho Vehicle.
// TODO: Them method tim theo externalId, va loc theo make/model/year.
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Vehicle findByExternalId(String externalId);

    Vehicle findByMakeAndModelAndYear(String make, String model, Integer year);

}
