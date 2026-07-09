package com.VisualAlign.VisualAlign.payload.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// TODO: Request body de gan danh sach vehicleIds cho 1 product.
// TODO: Body mau:
// TODO: {
// TODO:   "vehicleIds": [1, 2, 3],
// TODO:   "fitType": "EXACT",
// TODO:   "note": "OEM mapping"
// TODO: }
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductFitmentAssignRequest {
    private List<Long> vehicleIds;
    private String fitType;
    private String note;
    private String source;
    private String confidence;
}
