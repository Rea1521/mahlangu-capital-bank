package com.banking.controller;

import com.banking.model.Account;
import com.banking.model.Transaction;
import com.banking.model.TransactionCategory;
import com.banking.dto.TransactionDTO;
import com.banking.service.AccountService;
import com.banking.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "https://mahlangu-capital-bank-frontend.onrender.com", allowCredentials = "true")
public class TransactionController {
    
    @Autowired
    private TransactionService transactionService;
    
    @Autowired
    private AccountService accountService;
    
    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<?> getAccountTransactions(@PathVariable String accountNumber) {
        try {
            Account account = accountService.getAccount(accountNumber);
            List<Transaction> transactions = transactionService
                .getTransactionsByDateRange(account, LocalDate.now().minusMonths(1), LocalDate.now());
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/account/{accountNumber}/daterange")
    public ResponseEntity<?> getTransactionsByDateRange(
            @PathVariable String accountNumber,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        try {
            Account account = accountService.getAccount(accountNumber);
            List<Transaction> transactions = transactionService
                .getTransactionsByDateRange(account, startDate, endDate);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/account/{accountNumber}/category/{category}")
    public ResponseEntity<?> getTransactionsByCategory(
            @PathVariable String accountNumber,
            @PathVariable String category) {
        try {
            Account account = accountService.getAccount(accountNumber);
            // Convert string category to enum
            TransactionCategory categoryEnum;
            try {
                categoryEnum = TransactionCategory.valueOf(category.toUpperCase());
            } catch (IllegalArgumentException e) {
                categoryEnum = TransactionCategory.OTHER;
            }
            List<Transaction> transactions = transactionService
                .getTransactionsByCategory(account, categoryEnum);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/transfer")
    public ResponseEntity<?> transferFunds(@RequestParam String fromAccount,
                                           @RequestParam String toAccount,
                                           @RequestParam Double amount,
                                           @RequestParam String pin,
                                           @RequestParam(required = false) String description) {
        try {
            accountService.transfer(fromAccount, toAccount, 
                java.math.BigDecimal.valueOf(amount), pin, description);
            return ResponseEntity.ok("Transfer successful");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}