package com.VisualAlign.VisualAlign.service.impl;

import org.springframework.stereotype.Service;

import com.VisualAlign.VisualAlign.modal.Vehicle;
import com.VisualAlign.VisualAlign.payload.dto.VehicleDto;
import com.VisualAlign.VisualAlign.repository.VehicleRepository;
import com.VisualAlign.VisualAlign.service.VehicleCatalogService;
import lombok.RequiredArgsConstructor;

// TODO: Implement VehicleCatalogService.
// TODO: Goi API xe mien phi (goi y: NHTSA vPIC) thong qua backend.
// TODO: Them timeout + retry hop ly, va fallback local cache neu API ngoai loi.
@Service
@RequiredArgsConstructor
public class VehicleCatalogServiceimplement implements VehicleCatalogService {
    private final VehicleRepository vehicleRepository;

    @Override
    public VehicleDto getVehicleByExternalId(String externalId) {
        return vehicleRepository.findAll().stream()
                .filter(vehicle -> externalId != null && externalId.equals(vehicle.getExternalId()))
                .findFirst()
                .map(this::mapToVehicleDto)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with externalId: " + externalId));
    }

    @Override
    public VehicleDto getVehicleByMakeModelYear(String make, String model, Integer year) {
        return vehicleRepository.findAll().stream()
                .filter(vehicle -> matchesVehicle(vehicle, make, model, year))
                .findFirst()
                .map(this::mapToVehicleDto)
                .orElseThrow(() -> new RuntimeException(
                        "Vehicle not found for make/model/year: " + make + "/" + model + "/" + year));
    }

    @Override
    public VehicleDto getVehicleByExternalIdMakeModelYear(String externalId, String make, String model, Integer year) {
        return vehicleRepository.findAll().stream()
                .filter(vehicle -> matchesVehicle(vehicle, make, model, year)
                        && (externalId == null || externalId.equals(vehicle.getExternalId())))
                .findFirst()
                .map(this::mapToVehicleDto)
                .orElseGet(() -> getVehicleByMakeModelYear(make, model, year));
    }

    private boolean matchesVehicle(Vehicle vehicle, String make, String model, Integer year) {
        return (make == null || make.equalsIgnoreCase(vehicle.getMake()))
                && (model == null || model.equalsIgnoreCase(vehicle.getModel()))
                && (year == null || year.equals(vehicle.getYear()));
    }

    private VehicleDto mapToVehicleDto(Vehicle vehicle) {
        return VehicleDto.builder()
                .id(vehicle.getId())
                .externalId(vehicle.getExternalId())
                .make(vehicle.getMake())
                .model(vehicle.getModel())
                .year(vehicle.getYear())
                .trim(vehicle.getTrim())
                .build();
    }

    @SuppressWarnings("unused")
    private Vehicle mapToVehicleEntity(VehicleDto vehicleDto) {
        return Vehicle.builder()
                .id(vehicleDto.getId())
                .externalId(vehicleDto.getExternalId())
                .make(vehicleDto.getMake())
                .model(vehicleDto.getModel())
                .year(vehicleDto.getYear())
                .trim(vehicleDto.getTrim())
                .build();
    }
}
