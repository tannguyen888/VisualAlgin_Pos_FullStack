package com.VisualAlign.VisualAlign.service;

import java.util.List;

import com.VisualAlign.VisualAlign.domain.StoreStatus;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.StoreDto;

public interface StoreService {
    StoreDto createStore(StoreDto storeDto, User user);

    StoreDto getStoreById(Long id);

    List<StoreDto> getAllStores();

    StoreDto updateStore(Long id, StoreDto storeDto);

    StoreDto getStoreByAdmin(User user);

    StoreDto getStoreByEmployee(User user);

    void deleteStore(Long id);

    void saveStore(StoreDto storeDto);

    StoreDto moderateStore(Long id, StoreStatus status);

}
