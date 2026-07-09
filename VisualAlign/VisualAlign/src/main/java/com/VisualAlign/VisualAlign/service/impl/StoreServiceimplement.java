package com.VisualAlign.VisualAlign.service.impl;

import com.VisualAlign.VisualAlign.repository.*;
import java.util.List;

import org.springframework.stereotype.Service;

import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.mapper.StoreMapper;
import com.VisualAlign.VisualAlign.modal.Store;
import com.VisualAlign.VisualAlign.modal.StoreContact;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.StoreDto;
import com.VisualAlign.VisualAlign.service.StoreService;
import com.VisualAlign.VisualAlign.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StoreServiceimplement implements StoreService {

    private final StoreRepository storeRepository;
    private final UserService userService;

    @Override
    public StoreDto createStore(StoreDto storeDto, User user) {
        Store store = StoreMapper.toEntity(storeDto, user);
        return StoreMapper.toDto(storeRepository.save(store));
        // Store createStore = new Store();
        // createStore.setName(storeDto.getName());
        // createStore.setAddress(storeDto.getAddress());
        // createStore.setPhone(storeDto.getPhone());
        // createStore.setEmail(storeDto.getEmail());
        // createStore.setStoreAdmin(user.getRole() ==
        // com.VisualAlign.VisualAlign.domain.UserRole.ROLE_ADMIN ? user : null);
        // return StoreMapper.toDto(storeRepository.save(createStore));
    }

    @Override
    public StoreDto getStoreById(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + id));
        return StoreMapper.toDto(store);
    }

    @Override
    public List<StoreDto> getAllStores() {
        List<Store> stores = storeRepository.findAll();
        return stores.stream().map(StoreMapper::toDto).toList();
    }

    @Override
    public StoreDto updateStore(Long id, StoreDto storeDto) {
        Store existingStore = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + id));
        existingStore.setBrand(storeDto.getBrand());
        existingStore.setDescription(storeDto.getDescription());
        existingStore.setStoreType(storeDto.getStoreType());
        existingStore.setStatus(storeDto.getStatus());
        existingStore.setContact(storeDto.getContact() != null ? StoreContact.builder()
                .address(storeDto.getContact().getAddress())
                .phone(storeDto.getContact().getPhone())
                .email(storeDto.getContact().getEmail())
                .build() : existingStore.getContact());
        return StoreMapper.toDto(storeRepository.save(existingStore));
    }

    @Override
    public StoreDto getStoreByAdmin(User user) throws RuntimeException {
        User currentUser = user;
        if (currentUser == null) {
            try {
                currentUser = userService.getCurrentUser();
            } catch (UserException e) {
                throw new RuntimeException(e.getMessage(), e);
            }
        }

        if (currentUser == null) {
            throw new RuntimeException("Current user is null");
        }
        if (currentUser.getId() == null) {
            throw new RuntimeException("Current user id is null");
        }

        Store store = storeRepository.findByStoreAdminId(currentUser.getId());
        if (store == null) {
            throw new RuntimeException("Store not found for admin with id: " + currentUser.getId());
        }
        return StoreMapper.toDto(store);
    }

    @Override
    public StoreDto getStoreByEmployee(User user) {
        User currentUser = user;
        if (currentUser == null) {
            try {
                currentUser = userService.getCurrentUser();
            } catch (UserException e) {
                throw new RuntimeException(e.getMessage(), e);
            }
        }

        if (currentUser == null) {
            throw new RuntimeException("Current user is null");
        }
        if (currentUser.getId() == null) {
            throw new RuntimeException("Current user id is null");
        }

        if (currentUser.getRole() == com.VisualAlign.VisualAlign.domain.UserRole.ROLE_ADMIN) {
            throw new RuntimeException("Current user is an admin, not an employee.");
        }

        Store store = currentUser.getStore();
        if (store == null) {
            throw new RuntimeException("Store not found for employee with id: " + currentUser.getId());
        }
        return StoreMapper.toDto(store);

    }

    @Override
    public void deleteStore(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + id));
        storeRepository.delete(store);
    }

    @Override
    public void saveStore(StoreDto storeDto) {
        Store store = StoreMapper.toEntity(storeDto, null);
        storeRepository.save(store);
    }

    @Override
    public StoreDto moderateStore(Long id, com.VisualAlign.VisualAlign.domain.StoreStatus status) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Store not found with id: " + id));
        store.setStatus(status);
        return StoreMapper.toDto(storeRepository.save(store));
    }

}
