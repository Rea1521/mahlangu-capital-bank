package com.banking.controller;

import com.banking.model.Account;
import com.banking.dto.AccountDTO;
import com.banking.service.AccountService;
import com.banking.model.AccountStatus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "https://mahlangu-capital-bank-frontend.onrender.com", allowCredentials = "true")
public class AccountController {
    
    @Autowired
    private AccountService accountService;
    
    @PostMapping("/customer/{customerId}")
    public ResponseEntity<?> createAccount(@PathVariable Long customerId,
                                          @Valid @RequestBody AccountDTO accountDTO) {
        try {
            Account account = accountService.createAccount(customerId, accountDTO);
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getCustomerAccounts(@PathVariable Long customerId) {
        try {
            List<Account> accounts = accountService.getCustomerAccounts(customerId);
            return ResponseEntity.ok(accounts);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/{accountNumber}")
    public ResponseEntity<?> getAccount(@PathVariable String accountNumber) {
        try {
            Account account = accountService.getAccount(accountNumber);
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{accountNumber}/deposit")
    public ResponseEntity<?> deposit(@PathVariable String accountNumber,
                                     @RequestParam Double amount,
                                     @RequestParam(required = false) String description) {
        try {
            Account account = accountService.deposit(accountNumber, 
                java.math.BigDecimal.valueOf(amount), description);
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/{accountNumber}/withdraw")
    public ResponseEntity<?> withdraw(@PathVariable String accountNumber,
                                      @RequestParam Double amount,
                                      @RequestParam String pin,
                                      @RequestParam(required = false) String description) {
        try {
            Account account = accountService.withdraw(accountNumber, 
                java.math.BigDecimal.valueOf(amount), pin, description);
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{accountNumber}/status")
    public ResponseEntity<?> updateAccountStatus(@PathVariable String accountNumber,
                                                 @RequestParam AccountStatus status) {
        try {
            Account account = accountService.updateAccountStatus(accountNumber, status);
            return ResponseEntity.ok(account);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}