package com.VisualAlign.VisualAlign.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.VisualAlign.VisualAlign.modal.Store;
import com.VisualAlign.VisualAlign.modal.User;

public interface StoreRepository extends JpaRepository<Store, Long> {
    Store findByStoreAdminId(Long id);

    Store findByStoreAdmin(User user);

}
