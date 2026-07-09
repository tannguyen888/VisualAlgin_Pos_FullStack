package com.VisualAlign.VisualAlign.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.VisualAlign.VisualAlign.mapper.ProductMapper;
import com.VisualAlign.VisualAlign.modal.Product;
import com.VisualAlign.VisualAlign.modal.ProductVehicleFitment;
import com.VisualAlign.VisualAlign.payload.dto.ProductFitmentAssignRequest;
import com.VisualAlign.VisualAlign.payload.dto.ProductDto;
import com.VisualAlign.VisualAlign.repository.ProductRepository;
import com.VisualAlign.VisualAlign.repository.ProductVehicleFitmentRepository;
import com.VisualAlign.VisualAlign.repository.VehicleRepository;
import com.VisualAlign.VisualAlign.service.ProductFitmentService;
import lombok.RequiredArgsConstructor;

// TODO: Implement ProductFitmentService.
// TODO: Validate product/vehicle ton tai truoc khi luu fitment.
// TODO: Xu ly idempotent khi gan lai danh sach fitment.
@Service
@RequiredArgsConstructor
public class ProductFitmentServiceimplement implements ProductFitmentService {
    private final ProductRepository productRepository;
    private final VehicleRepository vehicleRepository;
    private final ProductVehicleFitmentRepository productVehicleFitmentRepository;

    @Override
    public ProductFitmentAssignRequest assignFitmentsToProduct(Long productId, ProductFitmentAssignRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        List<Long> vehicleIds = request.getVehicleIds() == null ? List.of()
                : request.getVehicleIds().stream()
                        .filter(java.util.Objects::nonNull)
                        .distinct()
                        .toList();

        productVehicleFitmentRepository.deleteByProductId(productId);

        List<ProductVehicleFitment> fitments = vehicleIds.stream()
                .map(vehicleId -> vehicleRepository.findById(vehicleId)
                        .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + vehicleId)))
                .map(vehicle -> ProductVehicleFitment.builder()
                        .productId(product.getId())
                        .vehicleId(vehicle.getId())
                        .fitType(request.getFitType())
                        .note(request.getNote())
                        .source(request.getSource())
                        .confidence(request.getConfidence())
                        .build())
                .toList();

        productVehicleFitmentRepository.saveAll(fitments);
        return ProductFitmentAssignRequest.builder()
                .vehicleIds(vehicleIds)
                .fitType(request.getFitType())
                .note(request.getNote())
                .source(request.getSource())
                .confidence(request.getConfidence())
                .build();
    }

    @Override
    public ProductFitmentAssignRequest getFitmentsByProduct(Long productId) {
        List<ProductVehicleFitment> fitments = productVehicleFitmentRepository.findByProductId(productId);
        ProductVehicleFitment firstFitment = fitments.stream().findFirst().orElse(null);

        return ProductFitmentAssignRequest.builder()
                .vehicleIds(fitments.stream()
                        .filter(fitment -> fitment != null)
                        .map(fitment -> fitment.getVehicleId())
                        .distinct()
                        .toList())
                .fitType(firstFitment == null ? null : firstFitment.getFitType())
                .note(firstFitment == null ? null : firstFitment.getNote())
                .source(firstFitment == null ? null : firstFitment.getSource())
                .confidence(firstFitment == null ? null : firstFitment.getConfidence())
                .build();
    }

    @Override
    public List<ProductDto> getCompatibleProducts(Long storeId, String make, String model, Integer year) {
        List<Long> matchingVehicleIds = vehicleRepository.findAll().stream()
                .filter(vehicle -> (make == null || make.equalsIgnoreCase(vehicle.getMake()))
                        && (model == null || model.equalsIgnoreCase(vehicle.getModel()))
                        && (year == null || year.equals(vehicle.getYear())))
                .map(vehicle -> vehicle.getId())
                .toList();

        if (matchingVehicleIds.isEmpty()) {
            return List.of();
        }

        List<Long> compatibleProductIds = productVehicleFitmentRepository.findByVehicleIdIn(matchingVehicleIds).stream()
                .filter(fitment -> fitment != null)
                .map(fitment -> fitment.getProductId())
                .distinct()
                .toList();

        return productRepository.findByStoreId(storeId).stream()
                .filter(product -> compatibleProductIds.contains(product.getId()))
                .map(product -> ProductMapper.toDto(product))
                .toList();
    }

}
