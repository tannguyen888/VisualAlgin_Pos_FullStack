package com.VisualAlign.VisualAlign.payload.dto;

import com.VisualAlign.VisualAlign.modal.Store;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

import lombok.Setter;

@Getter
@Setter
@Data
@Builder
public class CategoryDto {
    private Long id;

    private String name;

    // private Store store;

    private Long storeId;
}
