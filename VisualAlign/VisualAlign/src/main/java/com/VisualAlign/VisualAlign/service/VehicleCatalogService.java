package com.VisualAlign.VisualAlign.service;

import com.VisualAlign.VisualAlign.payload.dto.VehicleDto;

// TODO: Service quan ly catalog xe tu API mien phi + local cache.
public interface VehicleCatalogService {
    // TODO: getMakes()
    // TODO: getModelsByMakeAndYear(String make, Integer year)
    // TODO: searchLocalVehicles(String make, String model, Integer year)
    // TODO: syncVehiclesFromExternal()
    VehicleDto getVehicleByExternalId(String externalId);

    VehicleDto getVehicleByMakeModelYear(String make, String model, Integer year);

    VehicleDto getVehicleByExternalIdMakeModelYear(String externalId, String make, String model, Integer year);
}
