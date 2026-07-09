package com.VisualAlign.VisualAlign.service.impl;

import java.util.List;

import com.VisualAlign.VisualAlign.modal.Customer;
import com.VisualAlign.VisualAlign.repository.CustomerRepository;
import com.VisualAlign.VisualAlign.service.CustomerService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerServiceimplement implements CustomerService {

    private final CustomerRepository customerRepository;

    @Override
    public Customer creatCustomer(Customer customer) {
        return createCustomer(customer);
    }

    public Customer createCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(Long id, Customer customer) throws Exception {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new Exception("Customer not found with id: " + id));

        existingCustomer.setFirstName(customer.getFirstName());
        existingCustomer.setEmail(customer.getEmail());
        existingCustomer.setPhone(customer.getPhone());

        return customerRepository.save(existingCustomer);
    }

    @Override
    public void deleteCustomer(Long id) throws Exception {
        Customer existingCustomer = customerRepository.findById(id)
                .orElseThrow(() -> new Exception("Customer not found with id: " + id));
        customerRepository.delete(existingCustomer);
    }

    @Override
    public List<Customer> getAllCustomers() throws Exception {
        return customerRepository.findAll();
    }

    @Override
    public List<Customer> searchCustomers(String keyword) throws Exception {
        return customerRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword);
    }

}