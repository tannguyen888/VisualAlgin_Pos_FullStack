package com.VisualAlign.VisualAlign.mapper;

import com.VisualAlign.VisualAlign.modal.Store;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.StoreDto;

public class StoreMapper {
    public static StoreDto toDto(Store store) {
        StoreDto storeDto = new StoreDto();
        storeDto.setId(store.getId());
        storeDto.setBrand(store.getBrand());
        storeDto.setCreatedAt(store.getCreatedAt());
        storeDto.setUpdatedAt(store.getUpdatedAt());
        storeDto.setDescription(store.getDescription());
        storeDto.setStoreType(store.getStoreType());
        storeDto.setStatus(store.getStatus());
        storeDto.setContact(store.getContact());
        storeDto.setStoreAdmin(store.getStoreAdmin() != null ? store.getStoreAdmin().getEmail() : null);
        return storeDto;
    }

    public static Store toEntity(StoreDto storeDto, User storeAdmin) {
        Store store = new Store();
        store.setId(storeDto.getId());
        store.setBrand(storeDto.getBrand());
        store.setCreatedAt(storeDto.getCreatedAt());
        store.setUpdatedAt(storeDto.getUpdatedAt());
        store.setDescription(storeDto.getDescription());
        store.setStoreType(storeDto.getStoreType());
        store.setStatus(storeDto.getStatus());
        store.setContact(storeDto.getContact());
        store.setStoreAdmin(storeAdmin);
        return store;
    }
}
