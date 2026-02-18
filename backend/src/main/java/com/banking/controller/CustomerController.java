package com.banking.controller;

import com.banking.model.Customer;
import com.banking.dto.CustomerDTO;
import com.banking.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/customers")
@CrossOrigin(origins = "https://mahlangu-capital-bank-frontend.onrender.com", allowCredentials = "true")
public class CustomerController {
    
    @Autowired
    private CustomerService customerService;
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getCustomer(@PathVariable Long id) {
        try {
            Customer customer = customerService.getCustomerById(id);
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCustomer(@PathVariable Long id, 
                                           @RequestBody CustomerDTO customerDTO) {
        try {
            Customer customer = customerService.updateCustomer(id, customerDTO);
            return ResponseEntity.ok(customer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}