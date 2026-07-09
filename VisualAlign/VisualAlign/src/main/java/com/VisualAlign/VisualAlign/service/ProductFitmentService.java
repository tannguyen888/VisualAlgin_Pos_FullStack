package com.VisualAlign.VisualAlign.service;

import java.util.List;

import com.VisualAlign.VisualAlign.payload.dto.ProductDto;
import com.VisualAlign.VisualAlign.payload.dto.ProductFitmentAssignRequest;

// TODO: Service gan fitment va loc san pham theo xe.
public interface ProductFitmentService {
    // TODO: assignFitmentsToProduct(Long productId, ProductFitmentAssignRequest
    // request)
    // TODO: getFitmentsByProduct(Long productId)
    // TODO: getCompatibleProducts(Long storeId, String make, String model, Integer
    // year)

    ProductFitmentAssignRequest assignFitmentsToProduct(Long productId, ProductFitmentAssignRequest request);

    ProductFitmentAssignRequest getFitmentsByProduct(Long productId);

    List<ProductDto> getCompatibleProducts(Long storeId, String make, String model, Integer year);
}
