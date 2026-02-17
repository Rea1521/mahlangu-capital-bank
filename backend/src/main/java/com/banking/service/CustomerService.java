package com.banking.service;

import com.banking.model.Customer;
import com.banking.dto.CustomerDTO;
import com.banking.dto.LoginRequest;
import com.banking.repository.CustomerRepository;
import com.banking.security.PasswordUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CustomerService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    public Customer registerCustomer(CustomerDTO customerDTO) {
        if (customerRepository.existsByEmail(customerDTO.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        Customer customer = new Customer();
        customer.setFullName(customerDTO.getFullName());
        customer.setEmail(customerDTO.getEmail());
        customer.setPasswordHash(PasswordUtils.hashPassword(customerDTO.getPassword()));
        customer.setCustomerId(PasswordUtils.generateCustomerId());
        customer.setPhoneNumber(customerDTO.getPhoneNumber());
        customer.setAddress(customerDTO.getAddress());
        customer.setCreatedAt(LocalDateTime.now());
        
        return customerRepository.save(customer);
    }
    
    public Optional<Customer> login(LoginRequest loginRequest) {
        Optional<Customer> customerOpt = customerRepository.findByEmail(loginRequest.getEmail());
        
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            if (PasswordUtils.verifyPassword(loginRequest.getPassword(), customer.getPasswordHash())) {
                return Optional.of(customer);
            }
        }
        return Optional.empty();
    }
    
    public Customer getCustomerById(Long id) {
        return customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
    }
    
    public Customer getCustomerByEmail(String email) {
        return customerRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
    }
    
    public Customer updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer customer = getCustomerById(id);
        customer.setFullName(customerDTO.getFullName());
        customer.setPhoneNumber(customerDTO.getPhoneNumber());
        customer.setAddress(customerDTO.getAddress());
        return customerRepository.save(customer);
    }
}