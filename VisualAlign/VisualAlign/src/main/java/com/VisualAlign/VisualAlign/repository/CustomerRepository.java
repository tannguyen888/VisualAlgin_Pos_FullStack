package com.VisualAlign.VisualAlign.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.VisualAlign.VisualAlign.modal.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {

    @Query("""
            SELECT c
            FROM Customer c
            WHERE LOWER(c.firstName) LIKE LOWER(CONCAT(:keyword, '%'))
               OR LOWER(c.email) LIKE LOWER(CONCAT(:keyword, '%'))
               OR LOWER(c.phone) LIKE LOWER(CONCAT(:keyword, '%'))
            ORDER BY c.firstName ASC
            """)
    List<Customer> findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(
            @Param("keyword") String keyword);
}
