package com.VisualAlign.VisualAlign.payload.dto;

import java.time.LocalDateTime;

import com.VisualAlign.VisualAlign.domain.StoreStatus;
import com.VisualAlign.VisualAlign.modal.StoreContact;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class StoreDto {

    private Long id;

    private String brand;

    private String storeAdmin;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private String description;

    private String storeType;
    private StoreStatus status;

    private StoreContact contact = new StoreContact();
}
