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
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/account/{accountNumber}/all")
    public ResponseEntity<?> getAllAccountTransactions(@PathVariable String accountNumber) {
        try {
            Account account = accountService.getAccount(accountNumber);
            List<Transaction> transactions = transactionService.getAccountTransactions(account);
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
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
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/account/{accountNumber}/category/{category}")
    public ResponseEntity<?> getTransactionsByCategory(
            @PathVariable String accountNumber,
            @PathVariable String category) {
        try {
            Account account = accountService.getAccount(accountNumber);
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
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/transfer")
    public ResponseEntity<?> transferFunds(@RequestBody TransferRequest request) {
        try {
            TransferResult result = accountService.transfer(
                request.getFromAccount(),
                request.getToAccount(),
                BigDecimal.valueOf(request.getAmount()),
                request.getPin(),
                request.getDescription()
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Transfer successful");
            response.put("amount", request.getAmount());
            response.put("fromAccount", request.getFromAccount());
            response.put("toAccount", request.getToAccount());
            response.put("fromAccountBalance", result.getFromAccount().getBalance());
            response.put("toAccountBalance", result.getToAccount().getBalance());
            response.put("fromTransactionId", result.getFromTransaction().getTransactionId());
            response.put("toTransactionId", result.getToTransaction().getTransactionId());
            response.put("internalTransfer", result.isInternalTransfer());
            response.put("senderName", result.getSenderName());
            response.put("recipientName", result.getRecipientName());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "error", e.getMessage()
            ));
        }
    }
    
    @PostMapping("/transfer/validate")
    public ResponseEntity<?> validateTransfer(@RequestBody TransferValidationRequest request) {
        try {
            Account fromAccount = accountService.getAccount(request.getFromAccount());
            Account toAccount = accountService.getAccount(request.getToAccount());
            
            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("fromAccountExists", true);
            response.put("toAccountExists", true);
            response.put("fromAccountActive", fromAccount.getStatus().toString());
            response.put("toAccountActive", toAccount.getStatus().toString());
            response.put("fromAccountBalance", fromAccount.getBalance());
            response.put("fromAccountHolder", fromAccount.getCustomer().getFullName());
            response.put("toAccountHolder", toAccount.getCustomer().getFullName());
            response.put("internalTransfer", fromAccount.getCustomer().getId()
                    .equals(toAccount.getCustomer().getId()));
            response.put("sufficientFunds", fromAccount.getBalance()
                    .compareTo(BigDecimal.valueOf(request.getAmount())) >= 0);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "valid", false,
                "error", e.getMessage()
            ));
        }
    }
    
    // Request DTOs
    public static class TransferRequest {
        private String fromAccount;
        private String toAccount;
        private double amount;
        private String pin;
        private String description;
        
        // Getters and setters
        public String getFromAccount() { return fromAccount; }
        public void setFromAccount(String fromAccount) { this.fromAccount = fromAccount; }
        public String getToAccount() { return toAccount; }
        public void setToAccount(String toAccount) { this.toAccount = toAccount; }
        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
        public String getPin() { return pin; }
        public void setPin(String pin) { this.pin = pin; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
    
    public static class TransferValidationRequest {
        private String fromAccount;
        private String toAccount;
        private double amount;
        
        // Getters and setters
        public String getFromAccount() { return fromAccount; }
        public void setFromAccount(String fromAccount) { this.fromAccount = fromAccount; }
        public String getToAccount() { return toAccount; }
        public void setToAccount(String toAccount) { this.toAccount = toAccount; }
        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
    }
}