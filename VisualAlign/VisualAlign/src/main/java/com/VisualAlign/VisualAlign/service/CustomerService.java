package com.VisualAlign.VisualAlign.service;

import java.util.List;

import com.VisualAlign.VisualAlign.modal.Customer;

public interface CustomerService {
    Customer creatCustomer(Customer customer);

    Customer updateCustomer(Long id, Customer customer) throws Exception;

    void deleteCustomer(Long id) throws Exception;

    List<Customer> getAllCustomers() throws Exception;

    List<Customer> searchCustomers(String keyword) throws Exception;

}
