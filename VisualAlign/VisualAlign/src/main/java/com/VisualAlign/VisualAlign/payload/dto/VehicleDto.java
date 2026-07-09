package com.VisualAlign.VisualAlign.payload.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// TODO: DTO tra du lieu xe ve frontend.
// TODO: Giu payload gon nhe, uu tien field can cho bo loc.
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDto {
    // TODO: id, externalId, make, model, year, trim.
    private Long id;
    private String externalId;
    private String make;
    private String model;
    private Integer year;
    private String trim;

}
