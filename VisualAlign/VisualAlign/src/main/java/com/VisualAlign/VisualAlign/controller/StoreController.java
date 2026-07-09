package com.VisualAlign.VisualAlign.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.VisualAlign.VisualAlign.exception.UserException;
import com.VisualAlign.VisualAlign.modal.User;
import com.VisualAlign.VisualAlign.payload.dto.StoreDto;
import com.VisualAlign.VisualAlign.payload.request.ApiResponse;
import com.VisualAlign.VisualAlign.service.StoreService;
import com.VisualAlign.VisualAlign.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {
    private final StoreService storeService;
    private final UserService userService;

    @PostMapping("/create")
    public ResponseEntity<StoreDto> createStore(@RequestBody StoreDto storeDto,
            @RequestHeader("Authorization") String jwt) throws UserException {
        User user = userService.getUserFromJwttoken(jwt);
        StoreDto createdStore = storeService.createStore(storeDto, user);
        return ResponseEntity.ok(createdStore);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StoreDto> getStoreById(@PathVariable Long id) {
        StoreDto store = storeService.getStoreById(id);
        return ResponseEntity.ok(store);
    }

    @GetMapping("/all")
    public ResponseEntity<List<StoreDto>> getAllStores() {
        List<StoreDto> stores = storeService.getAllStores();
        return ResponseEntity.ok(stores);
    }

    @PostMapping("/update/{id}")
    public ResponseEntity<StoreDto> updateStore(@PathVariable Long id, @RequestBody StoreDto storeDto) {
        StoreDto updatedStore = storeService.updateStore(id, storeDto);
        return ResponseEntity.ok(updatedStore);
    }

    @GetMapping("/admin")
    public ResponseEntity<StoreDto> getStoresForAdmin(@RequestHeader("Authorization") String jwt)
            throws UserException {
        User user = userService.getUserFromJwttoken(jwt);
        StoreDto store = storeService.getStoreByAdmin(user);
        return ResponseEntity.ok(store);

    }

    @GetMapping("/employee")
    public ResponseEntity<StoreDto> getStoresForEmployee(@RequestHeader("Authorization") String jwt)
            throws UserException {
        User user = userService.getUserFromJwttoken(jwt);
        StoreDto store = storeService.getStoreByEmployee(user);
        return ResponseEntity.ok(store);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteStore(@PathVariable Long id) {
        storeService.deleteStore(id);
        ApiResponse response = new ApiResponse();
        response.setMessage("Store deleted successfully");
        return ResponseEntity.ok(response);
    }
}
